import { omit, get } from "lodash";
import log from "../logger";
import { Request, Response } from "express";
import {
  creatProduct,
  findProduct,
  findAndUpdateProduct,
  findAllProduct,
  deleteProduct,
  findProducts,
  countProduct,
} from "../service/product/product.service";
import fs from "fs";
import util from "util";
import { v2 as cloudinary } from "cloudinary";
import AWS from "aws-sdk";
import { v4 as uuidv4 } from "uuid";
// import uploadFile, { getFileStream } from "../s3";
import { profileEnd } from "console";

const unlinkFile = util.promisify(fs.unlink);

export const createProductHandler = async (req: Request, res: Response) => {
  try {
    const userId = get(req, "user._id");
    const userRole = get(req, "user.role");
    const body = req.body;

    if (String(userRole) !== "admin") {
      return res.status(401).json({
        status: 401,
        message:
          "You do not have the required permissions to create a product.",
      });
    }

    body.sellerId = userId;

    const product = await creatProduct({ ...body });

    return res.status(201).json({
      status: 201,
      product,
    });
  } catch (err) {
    log.error(err);
    return res.status(500).json({
      status: 500,
      message: "Ops something went wrong. Please try again later!!",
    });
  }
};

export const getImageHandler = async (req: Request, res: Response) => {
  // try {
  //   const file = req.file;
  //   const userId = get(req, "user._id");
  //   const userRole = get(req, "user.role");
  //   const key = get(req, "params.key");
  //   const readStream = getFileStream(key);
  //   readStream.pipe(res);
  // } catch (err) {
  //   log.error(err);
  //   return res.status(500).json({
  //     status: 500,
  //     message: "Ops something went wrong. Please try again later!!",
  //   });
  // }
};

export const productImageUploadHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const file = req.file;
    const userId = get(req, "user._id");
    const userRole = get(req, "user.role");
    const productId = get(req, "body.productId");

    if (!file) {
      return res.status(400).json({
        status: 400,
        message: "No file uploaded",
      });
    }

    // Upload the file to Cloudinary
    // @ts-ignore
    const uploadResponse = await cloudinary.uploader.upload(file.path);

    if (uploadResponse && uploadResponse.secure_url) {
      const imageUrl = uploadResponse.secure_url;
      const product = await findProduct({ _id: productId });

      if (!product) {
        return res.status(401).json({
          status: 401,
          message: "Project not found",
        });
      }

      if (String(userRole) !== "admin") {
        return res.status(401).json({
          status: 401,
          message:
            "You do not have the required permissions to update this project.",
        });
      }

      // Associate the image URL with the project data and update the project
      const updatedProduct = await findAndUpdateProduct(
        { _id: productId },
        { $set: { image: imageUrl } },
        { new: true }
      );

      return res.status(201).json({
        status: 201,
        project: updatedProduct,
      });
    } else {
      return res.status(500).json({
        status: 500,
        message: "Error uploading to Cloudinary",
      });
    }
  } catch (err) {
    log.error(err);
    return res.status(500).json({
      status: 500,
      message: "Ops something went wrong. Please try again later!!",
    });
  }
};

export const updateProductHandler = async (req: Request, res: Response) => {
  try {
    const userId = get(req, "user._id");
    const userRole = get(req, "user.role");
    const body = req.body;

    if (String(userRole) !== "admin") {
      return res.status(401).json({
        status: 401,
        message:
          "You do not have the required permissions to update this product.",
      });
    }

    const updateProduct = await findAndUpdateProduct(
      { _id: body.productId },
      { ...body },
      { new: true }
    );

    return res.status(201).json({
      status: 201,
      product: updateProduct,
    });
  } catch (err) {
    log.error(err);
    return res.status(500).json({
      status: 500,
      message: "Ops something went wrong. Please try again later!!",
    });
  }
};

export const findSingleProductHandler = async (req: Request, res: Response) => {
  try {
    const productId = get(req, "params.id");
    const product = await findProduct({ _id: productId, deleted: false });

    return res.status(201).json({
      status: 201,
      product,
    });
  } catch (err) {
    log.error(err);
    return res.status(500).json({
      status: 500,
      message: "Ops something went wrong. Please try again later!!",
    });
  }
};

export const findProductsHandler = async (req: Request, res: Response) => {
  try {
    let count = await countProduct({ deleted: false });

    // @ts-ignore
    const page = parseInt(get(req, "query.page")) || 1;

    let type = get(req, "query.type") || "deleted";

    // @ts-ignore
    const limit = parseInt(get(req, "query.limit")) || 10000;

    const skipIndex = (page - 1) * limit;
    let products;

    // @ts-ignore
    type = type.toLowerCase();
    // if (typeof type === "string") {
    //   type = type.toLowerCase();
    // }

    // @ts-ignore
    if (req?.user?.role !== "admin") {
      count = await countProduct({ deleted: false });
      products = await findProducts(
        { deleted: false },
        { skip: skipIndex, limit }
      );

      return res.status(201).json({
        status: 201,
        products,
        count,
      });
    }

    if (type === "all") {
      count = await countProduct({ deleted: false });
      products = await findProducts(
        { deleted: false },
        { skip: skipIndex, limit }
      );
    }

    if (type === "deleted") {
      count = await countProduct({ deleted: false });
      products = await findProducts(
        { deleted: false },
        { skip: skipIndex, limit }
      );
    }

    return res.status(201).json({
      status: 201,
      products,
      count,
    });
  } catch (err) {
    log.error(err);
    return res.status(500).json({
      status: 500,
      message: "Ops something went wrong. Please try again later!!",
    });
  }
};

export const deleteProductHandler = async (req: Request, res: Response) => {
  try {
    const productId = get(req, "params.id");
    const product = await findAndUpdateProduct(
      { _id: productId },
      { $set: { deleted: true } },
      { new: true }
    );

    return res.status(201).json({
      status: 201,
      message: "product deleted successfully",
      product,
    });
  } catch (err) {
    log.error(err);
    return res.status(500).json({
      status: 500,
      message: "Ops something went wrong. Please try again later!!",
    });
  }
};

export const getAwsPresignedURL = async (req: Request, res: Response) => {
  const s3 = new AWS.S3({
    accessKeyId: process.env.aws_S3_DEV_ACCESS_KEY,
    secretAccessKey: process.env.aws_S3_DEV_SECRET_KEY,
    signatureVersion: "v4",
    region: process.env.AWS_REGION,
  });

  const userId = get(req, "user._id");
  console.log("userId >> ", userId);

  const key = `${userId}/${uuidv4()}.jpeg`;
  try {
    const response = await s3.getSignedUrl("putObject", {
      Bucket: process.env.AWS_BUCKET_NAME,
      ContentType: "image/jpeg",
      Key: key,
    });

    console.log("response >> ", response);
    res.send({ key, url: response });
  } catch (err) {
    log.error(err);
    return res.status(500).json({
      status: 500,
      message: "Ops something went wrong. Please try again later!!",
    });
  }
};
