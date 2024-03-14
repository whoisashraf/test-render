import mongoose from "mongoose";
import { USER_TYPE } from "../utils/Constants";

export interface WishlistDocument extends mongoose.Document {
  userId: string;
  ProductList: Array<object>;
}

const categorySchema = new mongoose.Schema(
  {
    userId: { type: String, require: true },
    ProductList: { type: Array, require: true },
  },
  {
    timestamps: true,
  },
);

const Wishlist = mongoose.model<WishlistDocument>("Wishlist", categorySchema);
export default Wishlist;
