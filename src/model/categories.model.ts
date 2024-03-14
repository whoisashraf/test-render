import mongoose from "mongoose";
import { USER_TYPE } from "../utils/Constants";

export interface CategoryDocument extends mongoose.Document {
  name: string;
  description: string;
  img: string;
  createdBy: string;
  deleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, require: true },
    description: { type: String, require: true },
    img: { type: String, require: false },
    deleted: { type: Boolean, default: false },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      require: false,
    },
  },
  {
    timestamps: true,
  },
);

const Category = mongoose.model<CategoryDocument>("Category", categorySchema);
export default Category;
