import Order from './OrderMd.js';
import Cart from '../Cart/CartMd.js';
import Product from '../Product/ProductMd.js';
import { generateOrderNumber } from '../../Utils/generateOrderNumber.js';
import { requestPayment, verifyPayment } from '../Peyment/zarinpalService.js';
import { ENV } from '../../Config/env.js';

export const createOrder = async (req, res) => {
  try {
    const { shippingAddress } = req.body;

    if (
      !shippingAddress?.fullName ||
      !shippingAddress?.phone ||
      !shippingAddress?.province ||
      !shippingAddress?.city ||
      !shippingAddress?.fullAddress
    ) {
      return res.status(400).json({ message: 'اطلاعات آدرس ارسال کامل نیست' });
    }

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'سبد خرید شما خالی است' });
    }

    const orderItems = [];
    let itemsTotal = 0;

    for (const cartItem of cart.items) {
      const product = await Product.findById(cartItem.product);

      if (!product || !product.isActive) {
        return res.status(400).json({ message: `محصول "${cartItem.product}" دیگر موجود نیست` });
      }

      const variant = product.variants.id(cartItem.variantId);
      if (!variant || !variant.isActive) {
        return res.status(400).json({ message: `یکی از وریانت‌های سبد شما دیگر موجود نیست` });
      }

      if (variant.stock < cartItem.quantity) {
        return res
          .status(400)
          .json({ message: `موجودی "${product.name}" کافی نیست (${variant.stock} عدد باقی مانده)` });
      }

      const effectivePrice = variant.discountPrice || variant.price;
      const lineTotal = effectivePrice * cartItem.quantity;

      orderItems.push({
        product: product._id,
        variantId: variant._id,
        name: product.name,
        variantLabel: [variant.voltage, variant.size, variant.brand].filter(Boolean).join(' - '),
        price: effectivePrice,
        quantity: cartItem.quantity,
        lineTotal,
      });

      itemsTotal += lineTotal;
    }

    const shippingCost = 0; 
    const totalAmount = itemsTotal + shippingCost;

    const order = await Order.create({
      user: req.user._id,
      orderNumber: generateOrderNumber(),
      items: orderItems,
      shippingAddress,
      itemsTotal,
      shippingCost,
      totalAmount,
      status: 'pending_payment',
    });

    const amountInRial = totalAmount * 10;

    const { authority, paymentUrl } = await requestPayment({
      amount: amountInRial,
      description: `پرداخت سفارش ${order.orderNumber}`,
      callbackUrl: `${ENV.SERVER_URL}/api/orders/verify`,
      mobile: req.user.phone,
    });

    order.payment.authority = authority;
    await order.save();

    res.status(201).json({ paymentUrl, orderNumber: order.orderNumber });
  } catch (error) {
    res.status(500).json({ message: 'خطا در ایجاد سفارش', error: error.message });
  }
};

export const verifyOrderPayment = async (req, res) => {
  const { Authority, Status } = req.query;

  try {
    const order = await Order.findOne({ 'payment.authority': Authority });

    if (!order) {
      return res.redirect(`${ENV.CLIENT_URL}/checkout/result?status=not_found`);
    }

    if (order.status === 'paid') {
      return res.redirect(`${ENV.CLIENT_URL}/checkout/result?status=success&order=${order.orderNumber}`);
    }

    if (Status !== 'OK') {
      order.status = 'failed';
      await order.save();
      return res.redirect(`${ENV.CLIENT_URL}/checkout/result?status=cancelled&order=${order.orderNumber}`);
    }

    const amountInRial = order.totalAmount * 10;
    const { success, refId } = await verifyPayment({ amount: amountInRial, authority: Authority });

    if (!success) {
      order.status = 'failed';
      await order.save();
      return res.redirect(`${ENV.CLIENT_URL}/checkout/result?status=failed&order=${order.orderNumber}`);
    }


    const insufficientItems = [];

    for (const item of order.items) {
      const result = await Product.updateOne(
        {
          _id: item.product,
          'variants._id': item.variantId,
          'variants.stock': { $gte: item.quantity }, 
        },
        { $inc: { 'variants.$.stock': -item.quantity } }
      );

      if (result.matchedCount === 0) {
        insufficientItems.push(item.name);
      }
    }

    if (insufficientItems.length > 0) {
      order.status = 'failed';
      order.payment.refId = refId;
      order.payment.note = `پرداخت موفق ولی موجودی کافی نبود برای: ${insufficientItems.join(', ')} - نیاز به بازگشت وجه دستی`;
      await order.save();

      console.error(`⚠️ نیاز به بازگشت وجه دستی - سفارش ${order.orderNumber} - مبلغ: ${order.totalAmount}`);

      return res.redirect(`${ENV.CLIENT_URL}/checkout/result?status=out_of_stock&order=${order.orderNumber}`);
    }

    order.status = 'paid';
    order.payment.refId = refId;
    order.payment.paidAt = new Date();
    await order.save();

    await Cart.updateOne({ user: order.user }, { $set: { items: [] } });

    return res.redirect(`${ENV.CLIENT_URL}/checkout/result?status=success&order=${order.orderNumber}`);
  } catch (error) {
    console.error('Payment verification error:', error.message);
    return res.redirect(`${ENV.CLIENT_URL}/checkout/result?status=error`);
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'خطا در دریافت سفارشات', error: error.message });
  }
};

export const getOrderByNumber = async (req, res) => {
  try {
    const order = await Order.findOne({ orderNumber: req.params.orderNumber });

    if (!order) {
      return res.status(404).json({ message: 'سفارش یافت نشد' });
    }

    if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'شما دسترسی به این سفارش را ندارید' });
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: 'خطا در دریافت سفارش', error: error.message });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const skip = (Number(page) - 1) * Number(limit);

    const [orders, total] = await Promise.all([
      Order.find(filter)
        .populate('user', 'fullName phone')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Order.countDocuments(filter),
    ]);

    res.status(200).json({
      orders,
      pagination: { total, page: Number(page), pages: Math.ceil(total / Number(limit)) },
    });
  } catch (error) {
    res.status(500).json({ message: 'خطا در دریافت سفارشات', error: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowedTransitions = ['processing', 'shipped', 'delivered', 'cancelled'];

    if (!allowedTransitions.includes(status)) {
      return res.status(400).json({ message: 'وضعیت نامعتبر است' });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'سفارش یافت نشد' });
    }

    if (order.status !== 'paid' && !['shipped', 'delivered'].includes(order.status)) {
      if (order.status === 'pending_payment' || order.status === 'failed') {
        return res.status(400).json({ message: 'سفارش پرداخت نشده است' });
      }
    }

    if (status === 'cancelled' && order.status === 'paid') {
      for (const item of order.items) {
        await Product.updateOne(
          { _id: item.product, 'variants._id': item.variantId },
          { $inc: { 'variants.$.stock': item.quantity } }
        );
      }
    }

    order.status = status;
    await order.save();

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: 'خطا در بروزرسانی وضعیت سفارش', error: error.message });
  }
};