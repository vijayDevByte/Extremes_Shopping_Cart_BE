import mongoose from "mongoose";

export const addressSchema = new mongoose.Schema({
  street: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  pinCode: {
    type: String,
    required: true,
  },
  isDefault: {
    type: Boolean,
    default: false,
  },
});

export const cartSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    default: 1,
  },
});

export const wishListSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Products",
    required: true,
  },
  addedAt: {
    type: Date,
    default: Date.now,
  },
});

export const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
  },
  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Products",
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
    },
  ],
  totalAmount: {
    type: Number,
    required: true,
  },
  orderDate: {
    type: Date,
    default: Date.now,
  },
  deliveryAddress: addressSchema,
  status: {
    type: String,
    enum: ["Pending", "Shipped", "Delivered", "Cancelled"],
    default: "Pending",
  },
});

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    min: 8,
    max: 12,
  },
  role: {
    type: String,
    default: "user",
  },
  cart: {
    type: [cartSchema],
  },
  wishlist: {
    type: [wishListSchema],
  },
  orderHistory: {
    type: [orderSchema],
  },
  address: {
    type: [addressSchema],
  },
  paymentMethod: {
    type: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

userSchema.pre("save", function (next) {
  this.createdAt = Date.now();
  next();
});

/* 
creates a Mongoose model named User, 
which corresponds to the "users" collection in your MongoDB database,
 and enforces the schema defined by userSchema
 */

export const User = mongoose.model("users", userSchema);
