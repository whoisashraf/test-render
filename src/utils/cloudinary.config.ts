import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME as string,
  api_key: process.env.CLOUDINARY_API_KEY as string,
  api_secret: process.env.CLOUDINARY_SECRET_KEY as string,
});

//create instance of cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary,
  // @ts-ignore
  allowedFormats: ["jpg", "png", "gif", "jpeg"],
  params: {
    // @ts-ignore
    folder: "hizbas",
    transformation: [{ width: 500, height: 500, crop: "limit" }],
  },
});

export default storage;
