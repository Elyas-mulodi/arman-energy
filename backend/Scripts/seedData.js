import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Category from '../Modules/Category/CategoryMd.js';
import Product from '../Modules/Product/ProductMd.js';
import { slugify } from '../Utils/slugify.js';

dotenv.config();

const categoriesData = [
  { name: 'موتور کولر تک‌فاز', description: 'مناسب کولرهای خانگی' },
  { name: 'موتور کولر سه‌فاز', description: 'مناسب کولرهای صنعتی و بزرگ' },
  { name: 'پروانه کولر', description: 'انواع پروانه فلزی و پلاستیکی' },
];

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('متصل به دیتابیس شد');

    // پاک کردن داده‌های قبلی این دو مدل (فقط برای محیط تست/توسعه)
    await Category.deleteMany({});
    await Product.deleteMany({});
    console.log('داده‌های قبلی پاک شدند');

    // ساخت دسته‌بندی‌ها
    const createdCategories = [];
    for (const cat of categoriesData) {
      const category = await Category.create({
        name: cat.name,
        slug: slugify(cat.name),
        description: cat.description,
      });
      createdCategories.push(category);
    }
    console.log(`${createdCategories.length} دسته‌بندی ساخته شد`);

    // ساخت محصولات نمونه، هرکدوم با چند وریانت
    const productsData = [
      {
        name: 'موتور کولر الکتروژن مدل ۱۵۰۰',
        description: 'موتور کولر با کیفیت بالا و صدای کم، مناسب کولرهای آبی خانگی',
        category: createdCategories[0]._id,
        isFeatured: true,
        variants: [
          { voltage: '220V', size: '1/2 HP', brand: 'الکتروژن', sku: 'EG-1500-220-05', price: 850000, stock: 12 },
          { voltage: '220V', size: '3/4 HP', brand: 'الکتروژن', sku: 'EG-1500-220-075', price: 1050000, stock: 8 },
        ],
        specifications: [
          { key: 'دور موتور', value: '1500 دور' },
          { key: 'جنس بدنه', value: 'آلومینیوم' },
        ],
      },
      {
        name: 'موتور کولر سه‌فاز صنعتی مدل X3',
        description: 'مناسب کولرهای صنعتی با نیاز به توان بالا',
        category: createdCategories[1]._id,
        isFeatured: true,
        variants: [
          { voltage: '380V', size: '1 HP', brand: 'صنعتی', sku: 'X3-380-1HP', price: 1650000, discountPrice: 1450000, stock: 5 },
        ],
        specifications: [{ key: 'دور موتور', value: '2800 دور' }],
      },
      {
        name: 'پروانه فلزی کولر ۴۰ سانتی',
        description: 'پروانه فلزی مقاوم، سازگار با اکثر موتورهای استاندارد',
        category: createdCategories[2]._id,
        isFeatured: false,
        variants: [
          { size: '40cm', brand: 'استاندارد', sku: 'PR-METAL-40', price: 320000, stock: 20 },
        ],
        specifications: [],
      },
      {
        name: 'موتور کولر تک‌فاز اقتصادی',
        description: 'گزینه‌ی مقرون‌به‌صرفه برای کولرهای خانگی کوچک',
        category: createdCategories[0]._id,
        isFeatured: false,
        variants: [
          { voltage: '220V', size: '1/3 HP', brand: 'اکونومی', sku: 'ECO-220-033', price: 620000, stock: 0 },
        ],
        specifications: [],
      },
    ];

    for (const prod of productsData) {
      let slug = slugify(prod.name);
      const exists = await Product.findOne({ slug });
      if (exists) slug = `${slug}-${Date.now()}`;

      await Product.create({ ...prod, slug, images: [] });
    }

    console.log(`${productsData.length} محصول ساخته شد`);
    console.log('✅ Seed کامل شد');
    process.exit(0);
  } catch (error) {
    console.error('خطا در seed کردن داده‌ها:', error.message);
    process.exit(1);
  }
};

seedData();