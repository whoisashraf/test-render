import { omit, get } from "lodash";
import log from "../logger";
import { Request, Response } from "express";
import {
  createCart,
  findCart,
  findAllCart,
  findAndUpdateCart,
  deleteCart,
} from "../service/cart/cart.service";
import { findProduct, findProducts } from "../service/product/product.service";

export const updateCartHandler = async (req: Request, res: Response) => {
  try {
    const user = get(req, "user");
    //@ts-ignore
    const userName = user.username ? user.username : "";

    const cartItems = get(req, "body.cartItems");
    const userId = get(req, "user._id");

    const cartExists = await findCart({ userId });

    if (!cartExists) {
      let newCart = await createCart({
        //@ts-ignore
        userName: user?.username ? user.username : "",
        userId,
        cartItems,
      });

      return res.status(200).json({
        status: 200,
        cart: newCart,
        message: "Cart Updated successfully",
      });
    }

    const newCart = await findAndUpdateCart(
      { userId },
      { userName, cartItems },
      { new: true }
    );

    return res.status(200).json({
      status: 200,
      cart: newCart,
      message: "Cart Updated successfully",
    });
  } catch (err) {
    log.error(err);
    return res.status(500).json({
      status: 500,
      message: "Ops something went wrong. Please try again later!!",
    });
  }
};

export const getCartHandler = async (req: Request, res: Response) => {
  try {
    const user = get(req, "user");
    const userId = get(req, "user._id");

    const cart = await findCart({ userId });
    let newCart;

    if (!cart) {
      newCart = await createCart({
        //@ts-ignore
        userName: user?.username ? user.username : "",
        userId,
        cartItems: [],
      });

      return res.status(200).json({
        status: 200,
        cart: newCart,
      });
    }

    let cartItems = cart.cartItems;

    if (cartItems.length > 0) {
      const ItemIds = cartItems.map((item, i) => {
        return item.productId;
      });

      const products = await findProducts({ _id: { $in: ItemIds } });

      let inSufficientQtyArray: any[] = [];
      for (let i = 0; i < products.length; i++) {
        const elem = products[i];

        for (let j = 0; j < cartItems.length; j++) {
          const cartElem = cartItems[j];
          if (elem.quantity < cartElem.quantity)
            inSufficientQtyArray.push(elem._id);
        }
      }

      if (inSufficientQtyArray.length > 0) {
        const updatedCart = cartItems.filter((ct, i) => {
          if (!inSufficientQtyArray.includes(ct._id)) return ct;
        });

        cartItems = updatedCart;
        const updated = await findAndUpdateCart(
          { userId },
          //@ts-expect-error
          { cartItems },
          { new: true }
        );

        return res.status(200).json({
          status: 200,
          cart: updated,
        });
      }
    }

    return res.status(200).json({
      status: 200,
      cart,
    });
  } catch (err) {
    //log error with logger which doesn't block i/o like console.log does
    log.error(err);
    return res.status(500).json({
      status: 500,
      message: "Ops something went wrong. Please try again later!!",
    });
  }
};

export const clearCartItemsHandler = async (req: Request, res: Response) => {
  try {
    const userId = get(req, "user._id");

    const cart = await findAndUpdateCart(
      { userId },
      { $set: { cartItems: [] } },
      { new: true, upsert: true }
    );

    if (!cart)
      return res.status(404).json({
        status: 404,
        message: "No Items in cart.",
      });

    return res.status(200).json({
      status: 200,
      cart,
    });
  } catch (err) {
    //log error with logger which doesn't block i/o like console.log does
    log.error(err);
    return res.status(500).json({
      status: 500,
      message: "Ops something went wrong. Please try again later!!",
    });
  }
};

export const addToCartHandler = async (req: Request, res: Response) => {
  try {
    const body = get(req, "body");
    const { productName, productId, productImg, quantity, price } = body;
    const userId = get(req, "user._id");
    const user = get(req, "user");
    let cartItems = [];
    const item = {
      productName,
      productId,
      productImg,
      quantity: Number(quantity) > 0 ? quantity : 1,
      price,
    };

    let cart = await findCart({ userId });
    const product = await findProduct({ _id: productId });

    if (product && product?.quantity >= Number(quantity)) cartItems.push(item);
    else {
      return res.status(500).json({
        status: 500,
        message: "Selected Product is no longer available",
      });
    }

    if (!cart) {
      const newCart = await createCart({
        //@ts-ignore
        userName: user.username,
        userId,
        cartItems,
      });

      return res.status(200).json({
        status: 200,
        cart: newCart,
      });
    }

    const selectedItem = cart.cartItems.filter(
      (item, i) => item?.productId === productId
    );

    if (selectedItem.length > 0) {
      selectedItem[0].productName = productName;
      selectedItem[0].quantity =
        product.quantity > selectedItem[0].quantity
          ? selectedItem[0]?.quantity + 1
          : product.quantity;
      selectedItem[0].productName = productName;

      //@ts-ignore
      const updatedCart = await findAndUpdateCart(
        { userId },
        //@ts-expect-error
        { cartItems: cart?.cartItems ? cart.cartItems : [] },
        { new: true }
      );

      return res.status(200).json({
        status: 200,
        cart: updatedCart,
        message: `successfully updated ${productName}'s quantity in cart`,
      });
    }

    let update = {
      productName,
      productId,
      productImg,
      quantity: Number(quantity) > 0 ? quantity : 1,
      price,
    };

    const newCartItem = await findAndUpdateCart(
      { userId },
      { $push: { cartItems: update } },
      { new: true, upsert: true }
    );
    return res.status(200).json({
      status: 200,
      cart: newCartItem,
      message: `successfully added ${productName} to cart!!`,
    });
  } catch (err) {
    //log error with logger which doesn't block i/o like console.log does
    log.error(err);
    return res.status(500).json({
      status: 500,
      message: "Ops something went wrong. Please try again later!!",
    });
  }
};
