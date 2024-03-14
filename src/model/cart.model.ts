import mongoose from "mongoose";
import { SHIPPING_STATUS } from "../utils/Constants";

export interface CartDocument extends mongoose.Document {
    userId: string;
  userName: string;
  cartItems: Array<CartItemsDocument>;
}

export interface CartItemsDocument extends mongoose.Document {
  productName: string;
  productId: string;
  productImg: string;
  quantity: number;
  price: number;

}

const Items = new mongoose.Schema(
    { 
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
      }
});

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: false,
    },
    cartItems: {
      type: [Items],
      required: true,
      default: []
    }
  },
  { timestamps: true }
);

const Cart = mongoose.model<CartDocument>("Cart", cartSchema);
export default Cart;
