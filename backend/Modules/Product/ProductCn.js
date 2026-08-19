import Product from "./ProductMd.js";
import Category from "../Category/CategoryMd.js";
import { slugify } from "../../Utils/slugify.js";
import { saveImage, deleteImageFile } from "../../Utils/saveImage.js";

export const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      variants,
      specifications,
      isFeatured,
    } = req.body;

    if (!name || !category || !variants) {
      return res
        .status(400)
        .json({ message: "نام، دسته‌بندی و وریانت‌ها الزامی هستند" });
    }

    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(400).json({ message: "دسته‌بندی یافت نشد" });
    }

    const parsedVariants =
      typeof variants === "string" ? JSON.parse(variants) : variants;
    const parsedSpecs = specifications
      ? typeof specifications === "string"
        ? JSON.parse(specifications)
        : specifications
      : [];

    let slug = slugify(name);
    const slugExists = await Product.findOne({ slug });
    if (slugExists) {
      slug = `${slug}-${Date.now()}`;
    }

    let imageUrls = [];
    if (req.files && req.files.length > 0) {
      imageUrls = await Promise.all(
        req.files.map((file) => saveImage(file.buffer, "products")),
      );
    }

    const product = await Product.create({
      name,
      slug,
      description,
      category,
      images: imageUrls,
      variants: parsedVariants,
      specifications: parsedSpecs,
      isFeatured: isFeatured || false,
    });

    res.status(201).json(product);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "کد SKU وارد شده تکراری است" });
    }
    res
      .status(500)
      .json({ message: "خطا در ایجاد محصول", error: error.message });
  }
};

export const getProducts = async (req, res) => {
  try {
    const { category, search, page = 1, limit = 12, featured } = req.query;

    const filter = { isActive: true };

    if (category) filter.category = category;
    if (featured) filter.isFeatured = true;

    if (search) {
      // escape کردن کاراکترهای خاص regex تا کاربر نتونه با کاراکترهایی مثل ( . * باعث خطا بشه
      const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      filter.$or = [
        { name: { $regex: escapedSearch, $options: "i" } },
        { description: { $regex: escapedSearch, $options: "i" } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [products, total] = await Promise.all([
      Product.find(filter)
        .populate("category", "name slug")
        .select("-specifications")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Product.countDocuments(filter),
    ]);

    res.status(200).json({
      products,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "خطا در دریافت محصولات", error: error.message });
  }
};

export const getProductBySlug = async (req, res) => {
  try {
    const product = await Product.findOneAndUpdate(
      { slug: req.params.slug, isActive: true },
      { $inc: { viewCount: 1 } },
      { new: true },
    ).populate("category", "name slug");

    if (!product) {
      return res.status(404).json({ message: "محصول یافت نشد" });
    }

    res.status(200).json(product);
  } catch (error) {
    res
      .status(500)
      .json({ message: "خطا در دریافت محصول", error: error.message });
  }
};

export const getProductsAdmin = async (req, res) => {
  try {
    const products = await Product.find({})
      .populate("category", "name")
      .sort({ createdAt: -1 });

    res.status(200).json(products);
  } catch (error) {
    res
      .status(500)
      .json({ message: "خطا در دریافت محصولات", error: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "محصول یافت نشد" });
    }

    const {
      name,
      description,
      category,
      variants,
      specifications,
      isFeatured,
      isActive,
    } = req.body;

    if (name && name !== product.name) {
      product.name = name;
      let newSlug = slugify(name);
      const slugExists = await Product.findOne({
        slug: newSlug,
        _id: { $ne: product._id },
      });
      product.slug = slugExists ? `${newSlug}-${Date.now()}` : newSlug;
    }

    if (category) {
      const categoryExists = await Category.findById(category);
      if (!categoryExists) {
        return res.status(400).json({ message: "دسته‌بندی یافت نشد" });
      }
      product.category = category;
    }

    if (variants) {
      product.variants =
        typeof variants === "string" ? JSON.parse(variants) : variants;
    }

    if (specifications) {
      product.specifications =
        typeof specifications === "string"
          ? JSON.parse(specifications)
          : specifications;
    }

    if (req.files && req.files.length > 0) {
      const newImageUrls = await Promise.all(
        req.files.map((file) => saveImage(file.buffer, "products")),
      );
      product.images = [...product.images, ...newImageUrls];
    }

    product.description = description ?? product.description;
    product.isFeatured = isFeatured ?? product.isFeatured;
    product.isActive = isActive ?? product.isActive;

    const updated = await product.save();
    res.status(200).json(updated);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "کد SKU وارد شده تکراری است" });
    }
    res
      .status(500)
      .json({ message: "خطا در بروزرسانی محصول", error: error.message });
  }
};

export const deleteProductImage = async (req, res) => {
  try {
    const { imageUrl } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "محصول یافت نشد" });
    }

    product.images = product.images.filter((img) => img !== imageUrl);
    await product.save();
    deleteImageFile(imageUrl);

    res.status(200).json({ message: "تصویر حذف شد", images: product.images });
  } catch (error) {
    res.status(500).json({ message: "خطا در حذف تصویر", error: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "محصول یافت نشد" });
    }

    product.images.forEach((img) => deleteImageFile(img));

    await product.deleteOne();
    res.status(200).json({ message: "محصول با موفقیت حذف شد" });
  } catch (error) {
    res.status(500).json({ message: "خطا در حذف محصول", error: error.message });
  }
};
