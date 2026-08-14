import Cart from './CartMd.js';
import Product from '../Product/ProductMd.js';

const buildCartResponse = async (cart) => {
  const populatedCart = await cart.populate({
    path: 'items.product',
    select: 'name slug images variants isActive',
  });

  let subtotal = 0;
  const items = [];

  for (const item of populatedCart.items) {
    const product = item.product;

    if (!product || !product.isActive) {
      items.push({
        _id: item._id,
        available: false,
        message: 'این محصول دیگر موجود نیست',
      });
      continue;
    }

    const variant = product.variants.id(item.variantId);

    if (!variant || !variant.isActive) {
      items.push({
        _id: item._id,
        product: { name: product.name, slug: product.slug },
        available: false,
        message: 'این وریانت دیگر موجود نیست',
      });
      continue;
    }

    const effectivePrice = variant.discountPrice || variant.price;
    const isStockEnough = variant.stock >= item.quantity;
    const lineTotal = effectivePrice * item.quantity;

    if (isStockEnough) subtotal += lineTotal;

    items.push({
      _id: item._id,
      product: {
        _id: product._id,
        name: product.name,
        slug: product.slug,
        image: product.images[0] || null,
      },
      variant: {
        _id: variant._id,
        voltage: variant.voltage,
        size: variant.size,
        brand: variant.brand,
        price: variant.price,
        discountPrice: variant.discountPrice,
        stock: variant.stock,
      },
      quantity: item.quantity,
      lineTotal,
      available: true,
      stockWarning: !isStockEnough
        ? `فقط ${variant.stock} عدد موجود است`
        : null,
    });
  }

  return { _id: populatedCart._id, items, subtotal, itemCount: items.length };
};


export const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    const response = await buildCartResponse(cart);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: 'خطا در دریافت سبد خرید', error: error.message });
  }
};

export const addToCart = async (req, res) => {
  try {
    const { productId, variantId, quantity = 1 } = req.body;

    if (!productId || !variantId) {
      return res.status(400).json({ message: 'محصول و وریانت الزامی است' });
    }

    const product = await Product.findById(productId);
    if (!product || !product.isActive) {
      return res.status(404).json({ message: 'محصول یافت نشد' });
    }

    const variant = product.variants.id(variantId);
    if (!variant || !variant.isActive) {
      return res.status(404).json({ message: 'وریانت انتخاب‌شده یافت نشد' });
    }

    if (variant.stock < quantity) {
      return res.status(400).json({ message: `موجودی کافی نیست. فقط ${variant.stock} عدد موجود است` });
    }

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId && item.variantId.toString() === variantId
    );

    if (existingItem) {
      const newQuantity = existingItem.quantity + Number(quantity);
      if (variant.stock < newQuantity) {
        return res
          .status(400)
          .json({ message: `موجودی کافی نیست. فقط ${variant.stock} عدد موجود است` });
      }
      existingItem.quantity = newQuantity;
    } else {
      cart.items.push({ product: productId, variantId, quantity });
    }

    await cart.save();

    const response = await buildCartResponse(cart);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: 'خطا در افزودن به سبد خرید', error: error.message });
  }
};

export const updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({ message: 'تعداد باید حداقل ۱ باشد' });
    }

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: 'سبد خرید یافت نشد' });
    }

    const item = cart.items.id(req.params.itemId);
    if (!item) {
      return res.status(404).json({ message: 'آیتم در سبد یافت نشد' });
    }

    const product = await Product.findById(item.product);
    const variant = product?.variants.id(item.variantId);

    if (!variant || variant.stock < quantity) {
      return res
        .status(400)
        .json({ message: `موجودی کافی نیست. فقط ${variant?.stock || 0} عدد موجود است` });
    }

    item.quantity = quantity;
    await cart.save();

    const response = await buildCartResponse(cart);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: 'خطا در بروزرسانی سبد خرید', error: error.message });
  }
};

export const removeCartItem = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: 'سبد خرید یافت نشد' });
    }

    cart.items = cart.items.filter((item) => item._id.toString() !== req.params.itemId);
    await cart.save();

    const response = await buildCartResponse(cart);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: 'خطا در حذف از سبد خرید', error: error.message });
  }
};

export const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (cart) {
      cart.items = [];
      await cart.save();
    }
    res.status(200).json({ message: 'سبد خرید خالی شد', items: [], subtotal: 0 });
  } catch (error) {
    res.status(500).json({ message: 'خطا در خالی کردن سبد خرید', error: error.message });
  }
};