import Category from './CategoryMd.js';
import { slugify } from '../../Utils/slugify.js';
import { saveImage, deleteImageFile } from '../../Utils/saveImage.js';

export const createCategory = async (req, res) => {
  try {
    const { name, description, parent, order } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'نام دسته‌بندی الزامی است' });
    }

    let slug = slugify(name);

    const slugExists = await Category.findOne({ slug });
    if (slugExists) {
      slug = `${slug}-${Date.now()}`;
    }

    if (parent) {
      const parentExists = await Category.findById(parent);
      if (!parentExists) {
        return res.status(400).json({ message: 'دسته‌بندی والد یافت نشد' });
      }
    }

    const imageUrl = req.file ? await saveImage(req.file.buffer, 'categories') : '';

    const category = await Category.create({
      name,
      slug,
      description,
      parent: parent || null,
      order: order || 0,
      image: imageUrl,
    });

    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: 'خطا در ایجاد دسته‌بندی', error: error.message });
  }
};

export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true })
      .sort({ order: 1, createdAt: -1 })
      .lean();

    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: 'خطا در دریافت دسته‌بندی‌ها', error: error.message });
  }
};

export const getCategoriesAdmin = async (req, res) => {
  try {
    const categories = await Category.find({})
      .populate('parent', 'name')
      .sort({ order: 1, createdAt: -1 });

    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: 'خطا در دریافت دسته‌بندی‌ها', error: error.message });
  }
};

export const getCategoryBySlug = async (req, res) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug, isActive: true });

    if (!category) {
      return res.status(404).json({ message: 'دسته‌بندی یافت نشد' });
    }

    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: 'خطا در دریافت دسته‌بندی', error: error.message });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ message: 'دسته‌بندی یافت نشد' });
    }

    const { name, description, parent, order, isActive } = req.body;

    if (parent && parent === req.params.id) {
      return res.status(400).json({ message: 'دسته‌بندی نمی‌تواند والد خودش باشد' });
    }

    if (name && name !== category.name) {
      category.name = name;
      let newSlug = slugify(name);
      const slugExists = await Category.findOne({ slug: newSlug, _id: { $ne: category._id } });
      category.slug = slugExists ? `${newSlug}-${Date.now()}` : newSlug;
    }

    if (req.file) {
      if (category.image) {
        deleteImageFile(category.image);
      }
      category.image = await saveImage(req.file.buffer, 'categories');
    }

    category.description = description ?? category.description;
    category.parent = parent !== undefined ? parent || null : category.parent;
    category.order = order ?? category.order;
    category.isActive = isActive ?? category.isActive;

    const updated = await category.save();
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: 'خطا در بروزرسانی دسته‌بندی', error: error.message });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ message: 'دسته‌بندی یافت نشد' });
    }

    const hasChildren = await Category.findOne({ parent: category._id });
    if (hasChildren) {
      return res
        .status(400)
        .json({ message: 'ابتدا زیردسته‌های این دسته‌بندی را حذف یا جابجا کنید' });
    }

    if (category.image) {
      deleteImageFile(category.image);
    }

    await category.deleteOne();
    res.status(200).json({ message: 'دسته‌بندی با موفقیت حذف شد' });
  } catch (error) {
    res.status(500).json({ message: 'خطا در حذف دسته‌بندی', error: error.message });
  }
};