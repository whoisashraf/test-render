import express from "express";
import multer from "multer";
import requiresAdmin from "../../middleware/validation/requireAdmin";
import requiresUser from "../../middleware/validation/requiresUser";

import {
    cartValidationRules,
    cartItemsValidationRules,
    validate,
    cartUpdateValidationRules,
} from "../../middleware/validation/validator";

import {
  getCartHandler,
  clearCartItemsHandler,
  addToCartHandler,
  updateCartHandler,
} from "../../controller/cart.controller";

const CartRouter = express.Router();

CartRouter.use(requiresUser)
CartRouter.post("/update", cartUpdateValidationRules(), validate, updateCartHandler)
CartRouter.get("/get", getCartHandler)
CartRouter.delete("/clear", clearCartItemsHandler)
CartRouter.post("/addtocart", cartItemsValidationRules(), validate, addToCartHandler)

export default CartRouter;