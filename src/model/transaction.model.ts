import mongoose from "mongoose";
import { SHIPPING_STATUS, USER_TYPE } from "../utils/Constants";

export interface CartItemsDocument extends mongoose.Document {
  productName: string;
  productId: string;
  total: string;
  productImg: string;
  quantity: number;
  price: number;
  shipingStatus: string;
}

export interface TransactionDocument extends mongoose.Document {
  userId: string;
  // referenceId: string;
  description: string;
  total: string;
  paymentVerified: boolean;
  shippingStatus: string;
  image: string;
  cartItems: Array<CartItemsDocument>;
}

const Items = new mongoose.Schema({
  productName: {
    type: String,
    required: true,
  },
  productId: {
    type: String,
    required: true,
  },
  productImg: {
    type: String,
    required: false,
  },
  quantity: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  shippingStatus: {
    type: String,
    required: false,
  },
});

const transactionSchema = new mongoose.Schema(
  {
    userId: { type: String, require: true },
    image: { type: String, require: false },
    referenceId: { type: String, require: true },
    description: { type: String, require: false },
    total: { type: String, require: true },
    cartItems: { type: [Items], require: true },
    paymentVerified: { type: Boolean, require: true, default: false },
    shippingStatus: {
      type: String,
      require: true,
      enum: SHIPPING_STATUS,
      default: "processing",
    },
  },
  {
    timestamps: true,
  }
);

const Transaction = mongoose.model<TransactionDocument>(
  "Transaction",
  transactionSchema
);
export default Transaction;
