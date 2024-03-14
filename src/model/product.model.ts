import mongoose from "mongoose";
import { USER_TYPE } from "../utils/Constants";

export interface ProductDocument extends mongoose.Document {
  name: string;
  price: number;
  weight: string;
  dimensions: Array<object>;
  quantity: number;
  image: string;
  otherImages: Array<string>;
  sellerId: string;
  categoryId: string;
  description: string;
  productIsbn: string;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new mongoose.Schema(
  {
    name: { type: String, require: true },
    price: { type: Number, require: true },
    weight: { type: String, require: false },
    dimensions: {
      type: [{ width: String, height: String }],
      require: false,
    },
    quantity: {
      type: Number,
      required: true,
    },
    image: { type: String, require: false },
    otherImages: { type: Array, require: false },
    categoryId: { type: String, require: true },
    description: { type: String, require: true },
    productIsbn: { type: String, require: false },
    deleted: { type: Boolean, require: true, default: false },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model<ProductDocument>("Product", productSchema);
export default Product;
