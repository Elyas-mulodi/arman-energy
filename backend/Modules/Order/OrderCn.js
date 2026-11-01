import Order from "./OrderMd.js";
import Cart from "../Cart/CartMd.js";
import Product from "../Product/ProductMd.js";
import { generateOrderNumber } from "../../Utils/generateOrderNumber.js";
import { requestPayment, verifyPayment } from "../Peyment/zarinpalService.js";
import { ENV } from "../../Config/env.js";
import mongoose from "mongoose";
import {
  ALL_STATUSES,
  ORDER_TRANSITIONS,
  PAID_STATUSES,
  STOCK_RESERVED_STATUSES,
} from "../../Utils/orderStatus.js";
import {
  asString,
  normalizePhone,
  normalizePostalCode,
} from "../../Utils/validate.js";
import { sendError } from "../../Utils/sendError.js";

const createOrderWithUniqueNumber = async (data) => {
  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      return await Order.create({
        ...data,
        orderNumber: generateOrderNumber(),
      });
    } catch (error) {
      const isDuplicateNumber =
        error?.code === 11000 && error?.keyPattern?.orderNumber;
      if (!isDuplicateNumber) throw error;
    }
  }
  throw new Error("ساخت شماره سفارش ناموفق بود");
};

// @desc    Create order from cart + get Zarinpal payment URL
// @route   POST /api/orders
// @access  Private
export const createOrder = async (req, res) => {
  try {
    const raw = req.body?.shippingAddress;
    if (!raw || typeof raw !== "object") {
      return res.status(400).json({ message: "اطلاعات آدرس ارسال کامل نیست" });
    }

    const shippingAddress = {
      fullName: asString(raw.fullName),
      phone: normalizePhone(raw.phone),
      province: asString(raw.province),
      city: asString(raw.city),
      fullAddress: asString(raw.fullAddress),
      postalCode: normalizePostalCode(raw.postalCode),
    };

    if (
      !shippingAddress.fullName ||
      !shippingAddress.province ||
      !shippingAddress.city ||
      !shippingAddress.fullAddress
    ) {
      return res.status(400).json({ message: "اطلاعات آدرس ارسال کامل نیست" });
    }
    if (
      shippingAddress.fullName.length > 80 ||
      shippingAddress.province.length > 50 ||
      shippingAddress.city.length > 50 ||
      shippingAddress.fullAddress.length > 500
    ) {
      return res
        .status(400)
        .json({ message: "طول یکی از فیلدهای آدرس بیش از حد مجاز است" });
    }
    if (!shippingAddress.phone) {
      return res
        .status(400)
        .json({ message: "شماره موبایل گیرنده نامعتبر است" });
    }
    if (!shippingAddress.postalCode) {
      return res.status(400).json({ message: "کد پستی باید ۱۰ رقم باشد" });
    }

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "سبد خرید شما خالی است" });
    }

    const orderItems = [];
    let itemsTotal = 0;

    for (const cartItem of cart.items) {
      const product = await Product.findById(cartItem.product);

      if (!product || !product.isActive) {
        return res
          .status(400)
          .json({
            message:
              "یکی از محصولات سبد خرید دیگر موجود نیست. سبد را اصلاح کنید",
          });
      }

      const variant = product.variants.id(cartItem.variantId);
      if (!variant || !variant.isActive) {
        return res
          .status(400)
          .json({
            message: `وریانت انتخاب‌شده‌ی «${product.name}» دیگر موجود نیست`,
          });
      }

      if (variant.stock < cartItem.quantity) {
        return res.status(400).json({
          message: `موجودی «${product.name}» کافی نیست (${variant.stock} عدد باقی مانده)`,
        });
      }

      const effectivePrice = variant.discountPrice || variant.price;
      const lineTotal = effectivePrice * cartItem.quantity;

      orderItems.push({
        product: product._id,
        variantId: variant._id,
        name: product.name,
        variantLabel: [variant.voltage, variant.size, variant.brand]
          .filter(Boolean)
          .join(" - "),
        price: effectivePrice,
        quantity: cartItem.quantity,
        lineTotal,
      });

      itemsTotal += lineTotal;
    }

    const shippingCost = 0;
    const totalAmount = itemsTotal + shippingCost;

    const order = await createOrderWithUniqueNumber({
      user: req.user._id,
      items: orderItems,
      shippingAddress,
      itemsTotal,
      shippingCost,
      totalAmount,
      status: "pending_payment",
    });

    let payment;
    try {
      payment = await requestPayment({
        amount: totalAmount * 10, // تومان به ریال
        description: `پرداخت سفارش ${order.orderNumber}`,
        callbackUrl: `${ENV.SERVER_URL}/api/orders/verify`,
        mobile: req.user.phone,
      });
    } catch (gatewayError) {
      console.error("خطا در اتصال به درگاه:", gatewayError.message);
      await Order.deleteOne({ _id: order._id }); // سفارش نیمه‌کاره نماند
      return res
        .status(502)
        .json({
          message: "اتصال به درگاه پرداخت برقرار نشد. لطفا دوباره تلاش کنید",
        });
    }

    order.payment.authority = payment.authority;
    await order.save();

    res
      .status(201)
      .json({ paymentUrl: payment.paymentUrl, orderNumber: order.orderNumber });
  } catch (error) {
    return sendError(res, error, "خطا در ایجاد سفارش");
  }
};

// وضعیت سفارش را به پارامتر صفحه‌ی نتیجه تبدیل می‌کند
const toResultStatus = (order) => {
  if (PAID_STATUSES.includes(order.status)) return "success";
  if (order.status === "failed" && order.payment?.refId) return "out_of_stock"; // پول آمده، کالا نبوده
  if (order.status === "cancelled") return "error";
  return "failed";
};

// @desc    Zarinpal callback - verify payment
// @route   GET /api/orders/verify
// @access  Public
export const verifyOrderPayment = async (req, res) => {
  const authority =
    typeof req.query.Authority === "string" ? req.query.Authority : "";
  const gatewayStatus =
    typeof req.query.Status === "string" ? req.query.Status : "";

  const resultUrl = (status, orderNumber) =>
    `${ENV.CLIENT_URL}/checkout/result?status=${status}${
      orderNumber ? `&order=${encodeURIComponent(orderNumber)}` : ""
    }`;

  // بدون Authority معتبر نباید هیچ سفارشی لمس شود
  if (!/^[A-Za-z0-9]{10,64}$/.test(authority)) {
    return res.redirect(resultUrl("not_found"));
  }

  try {
    const order = await Order.findOne({ "payment.authority": authority });
    if (!order) return res.redirect(resultUrl("not_found"));

    // قبلا پردازش شده (رفرش صفحه یا تکرار callback)
    if (order.status !== "pending_payment") {
      return res.redirect(resultUrl(toResultStatus(order), order.orderNumber));
    }

    if (gatewayStatus !== "OK") {
      await Order.updateOne(
        { _id: order._id, status: "pending_payment" },
        { $set: { status: "failed" } },
      );
      return res.redirect(resultUrl("cancelled", order.orderNumber));
    }

    const { success, refId } = await verifyPayment({
      amount: order.totalAmount * 10,
      authority,
    });

    if (!success) {
      await Order.updateOne(
        { _id: order._id, status: "pending_payment" },
        { $set: { status: "failed" } },
      );
      return res.redirect(resultUrl("failed", order.orderNumber));
    }

    // فقط یک درخواست می‌تواند این سفارش را از pending_payment به paid ببرد
    const claimed = await Order.findOneAndUpdate(
      { _id: order._id, status: "pending_payment" },
      {
        $set: {
          status: "paid",
          "payment.refId": String(refId ?? ""),
          "payment.paidAt": new Date(),
        },
      },
      { returnDocument: "after" },
    );

    if (!claimed) {
      // درخواست همزمان دیگری پردازشش کرد؛ موجودی دوباره کم نمی‌شود
      const latest = await Order.findById(order._id);
      return res.redirect(
        resultUrl(toResultStatus(latest), latest.orderNumber),
      );
    }

    // رزرو موجودی. $elemMatch تضمین می‌کند شرط شناسه و موجودی روی همان وریانت چک شود
    const reserved = [];
    let shortItem = null;

    for (const item of claimed.items) {
      const { modifiedCount } = await Product.updateOne(
        {
          _id: item.product,
          variants: {
            $elemMatch: { _id: item.variantId, stock: { $gte: item.quantity } },
          },
        },
        { $inc: { "variants.$.stock": -item.quantity } },
      );

      if (modifiedCount === 0) {
        shortItem = item;
        break;
      }
      reserved.push(item);
    }

    if (shortItem) {
      // اقلامی که قبلا از همین سفارش کم شده بودند برگردند
      for (const item of reserved) {
        await Product.updateOne(
          { _id: item.product, "variants._id": item.variantId },
          { $inc: { "variants.$.stock": item.quantity } },
        );
      }

      await Order.updateOne(
        { _id: claimed._id },
        {
          $set: {
            status: "failed",
            "payment.note": `پرداخت موفق بود ولی موجودی «${shortItem.name}» کافی نبود؛ نیاز به بازگشت وجه دستی`,
          },
        },
      );

      console.error(
        `⚠️ نیاز به بازگشت وجه دستی - سفارش ${claimed.orderNumber} - مبلغ ${claimed.totalAmount} تومان`,
      );
      return res.redirect(resultUrl("out_of_stock", claimed.orderNumber));
    }

    await Cart.updateOne({ user: claimed.user }, { $set: { items: [] } });

    return res.redirect(resultUrl("success", claimed.orderNumber));
  } catch (error) {
    console.error("Payment verification error:", error.message);
    return res.redirect(resultUrl("error"));
  }
};


export const getOrderByNumber = async (req, res) => {
  try {
    const order = await Order.findOne({ orderNumber: req.params.orderNumber });

    if (!order) {
      return res.status(404).json({ message: "سفارش یافت نشد" });
    }

    if (
      order.user.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ message: "شما دسترسی به این سفارش را ندارید" });
    }

    res.status(200).json(order);
  } catch (error) {
    res
      .status(500)
      .json({ message: "خطا در دریافت سفارش", error: error.message });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const { status, search } = req.query;
    const pageNum = Math.max(Number(req.query.page) || 1, 1);
    const limitNum = Math.min(Math.max(Number(req.query.limit) || 20, 1), 100);

    const filter = {};

    if (status) {
      if (!ALL_STATUSES.includes(status)) {
        return res.status(400).json({ message: "وضعیت نامعتبر است" });
      }
      filter.status = status;
    }

    if (search && search.trim()) {
      const escaped = search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      filter.$or = [
        { orderNumber: { $regex: escaped, $options: "i" } },
        { "shippingAddress.phone": { $regex: escaped } },
        { "shippingAddress.fullName": { $regex: escaped, $options: "i" } },
      ];
    }

    const [orders, total] = await Promise.all([
      Order.find(filter)
        .populate("user", "fullName phone")
        .sort({ createdAt: -1 })
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum),
      Order.countDocuments(filter),
    ]);

    res.status(200).json({
      orders,
      pagination: { total, page: pageNum, pages: Math.ceil(total / limitNum) },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "خطا در دریافت سفارشات", error: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!ALL_STATUSES.includes(status)) {
      return res.status(400).json({ message: "وضعیت نامعتبر است" });
    }
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "شناسه سفارش نامعتبر است" });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "سفارش یافت نشد" });
    }

    const allowedNext = ORDER_TRANSITIONS[order.status] || [];
    if (!allowedNext.includes(status)) {
      return res
        .status(400)
        .json({ message: "این تغییر وضعیت برای سفارش مجاز نیست" });
    }

    // شرط status در کوئری: اگر همزمان کس دیگری وضعیت را عوض کرده باشد، تغییر دوباره اعمال نمی‌شود
    // (و در نتیجه موجودی هم دوبار برنمی‌گردد)
    const updated = await Order.findOneAndUpdate(
      { _id: order._id, status: order.status },
      { $set: { status } },
      { new: true },
    );

    if (!updated) {
      return res
        .status(409)
        .json({ message: "وضعیت سفارش همزمان تغییر کرد. صفحه را رفرش کنید" });
    }

    // لغو سفارشی که موجودی‌اش کم شده بود (paid یا processing): موجودی برگردد
    if (
      status === "cancelled" &&
      STOCK_RESERVED_STATUSES.includes(order.status)
    ) {
      for (const item of updated.items) {
        await Product.updateOne(
          { _id: item.product, "variants._id": item.variantId },
          { $inc: { "variants.$.stock": item.quantity } },
        );
      }
    }

    res.status(200).json(updated);
  } catch (error) {
    res
      .status(500)
      .json({ message: "خطا در بروزرسانی وضعیت سفارش", error: error.message });
  }
};
