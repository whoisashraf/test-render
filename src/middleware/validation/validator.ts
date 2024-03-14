import { body, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

export const userValidationRules = () => {
  return [
    body("phoneNum").not().isEmpty(),
    //validation email
    body("email").isEmail(),
    // password must be at least 5 chars long
    body("password").isLength({ min: 8 }),
    // password must be at least 5 chars long
    // body("passwordConfirmation").isLength({ min: 8 }),
  ];
};

export const updateOrderRules = () => {
  return [
    // userId must not be empty
    body("status")
      .not()
      .isEmpty()
      .isIn(["processing", "shipped", "delivered", "failed", "cancelled"]),
  ];
};

export const vendorValidationRules = () => {
  return [
    body("firstName").not().isEmpty(),
    body("lastName").not().isEmpty(),
    body("username").not().isEmpty(),
    body("img").not().isEmpty(),
    body("phoneNum").not().isEmpty(),
    body("additionalPhoneNum").not().isEmpty(),
    body("availability").not().isEmpty(),
    body("brandName").not().isEmpty(),
    body("BusinessInfo").isObject(),
    body("businessAccountDetails").isObject(),
    body("dob").isDate(),
    body("role").not().isEmpty(),
    //validation email
    body("email").isEmail(),
    // password must be at least 5 chars long
    body("password").isLength({ min: 8 }),
    // password must be at least 5 chars long
    // body("passwordConfirmation").isLength({ min: 8 }),
  ];
};

export const studentValidationRules = () => {
  return [
    // counselorId must not be empty
    body("counselorId").not().isEmpty(),
    // organizationId is required
    body("organizationId").not().isEmpty(),
    // phoneNum is required
    body("phoneNum").not().isEmpty(),
    // sex is required
    body("sex").not().isEmpty(),
    // grade is required
    body("grade").not().isEmpty(),
    // role is required
    body("role").not().isEmpty(),
    //validation email
    body("email").isEmail(),
    // password must be at least 5 chars long
    body("password").isLength({ min: 8 }),
    // password must be at least 5 chars long
    body("passwordConfirmation").isLength({ min: 8 }),
  ];
};

export const eventValidationRules = () => {
  return [
    // eventName must not be empty
    body("eventName").not().isEmpty(),
    // createdBy is required
    body("createdBy").not().isEmpty(),
    // organizationId is required
    body("organizationId").not().isEmpty(),
    // thumbNail is required
    body("thumbNail").not().isEmpty(),
    // backgroundImage is required
    body("backgroundImage").not().isEmpty(),
    // description is required
    body("description").not().isEmpty(),
    //attendees email
    body("date").not().isEmpty().isDate(),
  ];
};

export const cartValidationRules = () => {
  return [
    // userId must not be empty
    body("userId").not().isEmpty(),
    // userName is required
    body("userName").not().isEmpty(),
    // cartItems is required
    body("cartItems").isArray(),
  ];
};

export const cartUpdateValidationRules = () => {
  return [
    // cartItems is required
    body("cartItems").isArray(),
  ];
};

export const createCategoryRules = () => {
  return [
    // userId must not be empty
    body("name").not().isEmpty(),
    body("description").not().isEmpty(),

    // parent is optional
    body("parent").optional(),
    body("img").optional(),
  ];
};

export const updateCategoryRules = () => {
  return [
    // userId must not be empty
    body("name").optional(),
    body("categoryId").not().isEmpty(),
    body("description").not().isEmpty(),
    // parent is optional
    body("parent").optional(),
    body("img").optional(),
  ];
};

export const cartItemsValidationRules = () => {
  return [
    // productName must not be empty
    body("productName").not().isEmpty(),
    // itemPrice is required
    body("price").not().isEmpty(),
    // productId is required
    body("productId").not().isEmpty(),
    // quantity is required
    body("quantity").isNumeric(),
    // shippingStatus is required
    body("productImg").not().isEmpty(),
  ];
};

export const addToCartValidationRules = () => {
  return [
    // productName must not be empty
    body("userId").not().isEmpty(),
    // itemPrice is required
    body("productId").not().isEmpty(),
  ];
};

export const prooductValidationRule = () => {
  return [
    // name must not be empty
    body("name").not().isEmpty(),
    // price is required
    body("price").not().isEmpty(),
    // amount is required
    body("quantity").not().isEmpty(),
    //validation description
    body("description").not().isEmpty(),
    // password must be at least 5 chars long
  ];
};

export const prooductUpdateValidationRule = () => {
  return [
    // productId must not be empty
    body("productId").not().isEmpty(),
  ];
};

export const counsellorValidationRules = () => {
  return [
    // username must not be empty
    body("username").not().isEmpty(),
    // firstName is required
    body("firstName").not().isEmpty(),
    // lastName is required
    body("lastName").not().isEmpty(),
    // organizationId must not be empty
    body("organizationId").not().isEmpty(),
    // dob is required
    body("dob").not().isEmpty(),
    // phoneNum is required
    body("phoneNum").not().isEmpty(),
    // sex is required
    body("sex").not().isEmpty(),
    // role is required
    body("role").not().isEmpty(),
    //validation email
    body("email").isEmail(),
    // password must be at least 5 chars long
    body("password").isLength({ min: 8 }),
    // password must be at least 5 chars long
    body("passwordConfirmation").isLength({ min: 8 }),
  ];
};

export const userUpdateValidationRules = () => {
  return [
    // username must not be empty
    body("lastName").not().isEmpty(),
    // firstName is required
    body("firstName").not().isEmpty(),
    // username is required
    body("username").not().isEmpty(),
    // brandName is required
    body("brandName").not().isEmpty(),
    // availability is required
    body("availability")
      .not()
      .isEmpty()
      .isIn(["weekdays", "weekends", "everyday"]),
    // country is required
    body("country").not().isEmpty(),
    // address must not be empty
    body("address").not().isEmpty(),
    // city must not be empty
    body("city").not().isEmpty(),
    // phoneNum is required
    body("phoneNum").not().isEmpty(),
    // state is required
    body("state").not().isEmpty(),
    //validation email
    body("email").isEmail(),
  ];
};

export const userVendorUpdateValidationRules = () => {
  return [
    body("status")
      .not()
      .isEmpty()
      .isIn(["Active", "In-Active", "Not-Confirmed"]),
    //validation email
    body("email").isEmail(),
  ];
};

export const postValidationRules = () => {
  return [
    // tittle must not be empty
    body("title").not().isEmpty(),
    // body is required
    body("body").not().isEmpty(),
  ];
};

export const storeValidationRules = () => {
  return [
    // storeName must not be empty
    body("storeName").not().isEmpty(),
    // userId is required
    body("userId").not().isEmpty().isString(),
    // isRegistered is required
    body("isRegistered").isBoolean(),
    // phoneNumber is required
    body("phoneNumber").not().isEmpty(),
    // email is required
    body("email").not().isEmpty(),
    // address is required
    body("address").not().isEmpty(),
    // city is required
    body("city").not().isEmpty(),
    // country is required
    body("country").not().isEmpty(),
    // countryCode is required
    body("countryCode").not().isEmpty(),
  ];
};

export const createPostValidationRules = () => {
  return [
    // tittle must not be empty
    body("title").not().isEmpty(),
    // body is required
    body("body").not().isEmpty(),
  ];
};

export const updateValidationRules = () => {
  return [
    // tittle must not be empty
    body("title").not().isEmpty(),
    // body is required
    body("body").not().isEmpty(),
  ];
};

export const sessionValidationRules = () => {
  return [
    //validation email
    body("email").not().isEmpty(),
    // password must be at least 8 chars long
    body("password").isLength({ min: 8 }),
  ];
};

export const addAddressValidationRules = () => {
  return [
    //validation email
    body("address").not().isEmpty(),
    body("state").not().isEmpty(),
    body("country").not().isEmpty(),
    // password must be at least 8 chars long
    body("city").not().isEmpty(),
  ];
};

export const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const extractedErrors: any[] = [];
  //@ts-ignore
  errors.array().map((err) => extractedErrors.push({ [err?.param]: err?.msg }));

  return res.status(422).json({
    errors: extractedErrors,
  });
};
