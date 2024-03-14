import mongoose from "mongoose";
import { SHIPPING_STATUS, USER_TYPE } from "../utils/Constants";

export interface OrderDocument extends mongoose.Document {
  userId: string;
  // referenceId: string;
  transactionId: string;
  totalPayed: string;
  paymentVerified: boolean;
  shippingStatus: string;
  productName: string;
  address: object;
  productId: string;
  productImg: string;
  quantity: number;
  itemPrice: number;
  image: string;
}

const orderSchema = new mongoose.Schema(
  {
    userId: { type: String, require: true },
    // referenceId: { type: String, require: true },
    transactionId: { type: String, require: true },
    totalPayed: { type: String, require: true },
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
    address: {
      type: Object,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    itemPrice: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
      required: false,
    },
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

const Order = mongoose.model<OrderDocument>("Order", orderSchema);
export default Order;
