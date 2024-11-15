import mongoose from "mongoose";
import { type } from "os";

const categorySchema = mongoose.Schema({
  categoryName: {
    type: String,
    required: true,
    unique: true,
  },
  level: {
    type: String,
    default: 1,
  },
  parentCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "category",
    default: null,
  },
});

const ProductsSchema = mongoose.Schema({
  productName: {
    type: String,
    required: [true, "product name is required"],
  },
  productDescription: {
    type: String,
    required: [true, "product Description is required"],
  },
  productBrand: {
    type: String,
    required: [true, "Product Brand is required"],
  },
  productImages: {
    type: [String],
    validate: {
      validator: function (imageArray) {
        return imageArray.length <= 4;
      },
      message: "Four Images can be added",
    },
  },
  stocks: {
    total: { type: Number },
    S: { type: Number },
    M: { type: Number },
    L: { type: Number },
    XL: { type: Number },
  },
  category: { type: String, required: [true, "category is required"] },
  subCategory: { type: String, required: [true, "category is required"] },
  color: { type: String },
  material: { type: String },
  productPrice: {
    type: Number,
    required: true,
  },
  discountPercent: {
    type: Number,
  },
  deliveredAt: {
    type: Number,
  },
  isOutOfStock: {
    type: Boolean,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
  modifiedAt: {
    type: Date,
    default: Date.now,
  },
});

ProductsSchema.pre("save", function (next) {
  this.modifiedAt = Date.now();
  next();
});

export const Products = mongoose.model("products", ProductsSchema);
export const Category = mongoose.model("Category", categorySchema);