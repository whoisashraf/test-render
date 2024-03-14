import { omit, get } from "lodash";
import log from "../logger";
import { Request, Response } from "express";
import {
  createWishlist,
  findWishlist,
  findAndUpdate,
} from "../service/wishlist/wishlist.services";
import { findProduct } from "../service/product/product.service";


export const addToWishlistHandler = async (req: Request, res: Response) => {
    try {
      const body = get(req, "body");
      const { productId } = body;
      const userId = get(req, "user._id");
      const user = get(req, "user");
   
      let Wishlist = await findWishlist({ userId });
      const product = await findProduct({_id : productId})

      if(!product) {
          return res.status(500).json({
            status: 500,
            message: "Selected Product is no longer available",
          });
      }

      if (!Wishlist){

        const newWishlist = await createWishlist({
            userId,
            ProductList : [ productId ]        
        })

        return res.status(200).json({
          status: 200,
          Wishlist: newWishlist,
        });
      }

      const newWishlist = await findAndUpdate(
        { userId },
        { $push : { ProductList : productId }},
        { new: true, upsert: true }
      )
      
        return res.status(200).json({
          status: 200,
          Wishlist: newWishlist,
          message: `successfully added ${product.name} to Wishlist!!`
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


export const removeFromWishlistHandler = async (req: Request, res: Response) => {
    try {
        const body = get(req, "body");
        const { productId } = body;
        const userId = get(req, "user._id");
     
        let Wishlist = await findWishlist({ userId });
        const product = await findProduct({_id : productId})

        if (!Wishlist){
  
          const newWishlist = await createWishlist({
              userId,
              ProductList : [ ]        
          })
  
          return res.status(200).json({
            status: 200,
            Wishlist: newWishlist,
          });
        }
  
        const updatedWishList = await findAndUpdate(
          { userId },
          { $pull : { ProductList : productId }},
          { new: true, upsert: true }
        )
        
          return res.status(200).json({
            status: 200,
            Wishlist: updatedWishList,
            message: `successfully removed ${product?.name || productId } to Wishlist!!`
          });
  
      } catch (err) {
        //log error with logger which doesn't block i/o like console.log does
        log.error(err);
        return res.status(500).json({
          status: 500,
          message: "Ops something went wrong. Please try again later!!",
        });
      }
}

export const getWishlistHandler = async (req: Request, res: Response) => {
    try {
      const userId = get(req, "user._id");
  
      const Wishlist = await findWishlist({ userId });
      let newWishlist;

      if (!Wishlist){
  
        newWishlist = await createWishlist({
            userId,
            ProductList : [ ]        
        })

        return res.status(200).json({
          status: 200,
          Wishlist: [],
        });
      }

      return res.status(200).json({
        status: 200,
        Wishlist,
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


  export const clearWishlistItemsHandler = async (req: Request, res: Response) => {
    try {
      const userId = get(req, "user._id");
      console.log("got here deleting...")
      const Wishlist = await findAndUpdate({ userId }, {$set:{ "ProductList":[] }}, { new:true, upsert: true });
       
      return res.status(200).json({
        status: 200,
        Wishlist,
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

