import express from "express";
import multer from "multer";
import requiresUser from "../../middleware/validation/requiresUser";

import {
    cartValidationRules,
    cartItemsValidationRules,
    validate,
    cartUpdateValidationRules,
    addToCartValidationRules,
} from "../../middleware/validation/validator";

import {
  getWishlistHandler,
  clearWishlistItemsHandler,
  addToWishlistHandler,
  removeFromWishlistHandler,
} from "../../controller/wishlist.controller";

const Wishlist = express.Router();

Wishlist.use(requiresUser)
Wishlist.get("/get", getWishlistHandler)
Wishlist.delete("/clear", clearWishlistItemsHandler)
Wishlist.post("/add", addToCartValidationRules(), validate, addToWishlistHandler)
Wishlist.post("/remove", cartItemsValidationRules(), validate, removeFromWishlistHandler)

export default Wishlist;