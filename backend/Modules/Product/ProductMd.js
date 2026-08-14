import mongoose from 'mongoose';

const variantSchema = new mongoose.Schema(
  {
    voltage: {
      type: String, 
      trim: true,
    },
    size: {
      type: String,
      trim: true,
    },
    brand: {
      type: String, 
      trim: true,
    },
    sku: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    discountPrice: {
      type: Number,
      min: 0,
      default: null,
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { _id: true }
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    images: [
      {
        type: String, 
      },
    ],
    variants: {
      type: [variantSchema],
      validate: {
        validator: (arr) => arr.length > 0,
        message: 'محصول باید حداقل یک وریانت داشته باشد',
      },
    },
    specifications: [
      {
        key: { type: String, trim: true },
        value: { type: String, trim: true }, 
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    viewCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ name: 'text', description: 'text' }); 

productSchema.virtual('totalStock').get(function () {
  return this.variants.reduce((sum, v) => sum + v.stock, 0);
});

productSchema.set('toJSON', { virtuals: true });

export default mongoose.model('Product', productSchema);