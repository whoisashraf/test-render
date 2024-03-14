import { DocumentDefinition, FilterQuery, UpdateQuery, QueryOptions } from "mongoose";
import User, { UserDocument } from "../../model/user.model";
import Vendor, { VendorDocument } from "../../model/vendor.model";
import { omit } from "lodash";

export const createUser = async (input: DocumentDefinition<UserDocument>) => {
  return await User.create(input);
};

export const createVendorUser = async (input: DocumentDefinition<VendorDocument>) => {
  return await Vendor.create(input);
};

export const validatePassword = async ({
  email,
  password,
}: {
  email: UserDocument["email"];
  password: string;
}) => {
  const user = await User.findOne({ email });

  if (!user) {
    return false;
  }

  const isValid = await user.comparePassword(password);

  if (!isValid) return false;

  return omit(user.toJSON(), "password");
};

export const validateWithEmail = async ({
  email,
  password,
}: {
  email: UserDocument["email"];
  password: string;
}) => {
  const user = await User.findOne({ email });

  if (!user) {
    return false;
  }

  const isValid = await user.comparePassword(password);

  if (!isValid) return false;

  return omit(user.toJSON(), "password");
};

export const findUser = async (query: FilterQuery<UserDocument>, options: QueryOptions = {}) => {
  return await User.findOne(query, options).lean();
};

export const findUsers = async (query: FilterQuery<UserDocument>, options: QueryOptions) => {
  return await User.find(query, options).lean();
};

export const findAndUpdate = async(
  query: FilterQuery<UserDocument>,
  update: UpdateQuery<UserDocument>,
  options: QueryOptions
) => {
  return await User.findOneAndUpdate(query, update, options);
};


export const findAndUpdateVendor = async(
  query: FilterQuery<VendorDocument>,
  update: UpdateQuery<VendorDocument>,
  options: QueryOptions
) => {
  return await Vendor.findOneAndUpdate(query, update, options);
};