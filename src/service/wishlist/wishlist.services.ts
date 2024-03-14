import { omit } from "lodash";
import {
  DocumentDefinition,
  FilterQuery,
  UpdateQuery,
  QueryOptions,
} from "mongoose";
import Wishlist, { WishlistDocument } from "../../model/wishlist.model";

export const createWishlist = async (input: DocumentDefinition<WishlistDocument>) => {
  return await Wishlist.create(input);
};

export const findWishlist = async (
  query: FilterQuery<WishlistDocument>,
  options: QueryOptions = { lean: true }
) => {
  return Wishlist.findOne(query, {}, options);
};

export const findAllWishlists = async () => {
  return Wishlist.find({});
};

export const findAndUpdate = (
  query: FilterQuery<WishlistDocument>,
  update: UpdateQuery<WishlistDocument>,
  options: QueryOptions
) => {
  return Wishlist.findOneAndUpdate(query, update, options);
};

export const deleteWishlist = async (query: FilterQuery<WishlistDocument>) => {
  return Wishlist.deleteOne(query);
};