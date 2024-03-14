//implemont router
import express from "express";
import { getAdminOrders, getAllOrders, getOrders, getSingleOrderHandler, updateOrderHandler, uploadOrderImageHandler, verifyPayment } from "../../controller/order.controller";
import { updateOrderRules, validate } from "../../middleware/validation/validator";
import requiresUser from "../../middleware/validation/requiresUser";
import storage from '../../utils/cloudinary.config'
import multer from "multer";

const upload = multer({ storage });


const OrderRouter = express.Router();

OrderRouter.use(requiresUser)
OrderRouter.get("/get/:id", getSingleOrderHandler );
OrderRouter.get("/get", getOrders);
OrderRouter.post("/upload", upload.single('image'), uploadOrderImageHandler);
OrderRouter.post("/update/:id", updateOrderRules(), validate, updateOrderHandler)
OrderRouter.post("/verify", verifyPayment)
OrderRouter.get('/getAdminOrder', getAdminOrders)
OrderRouter.get('/getall', getAllOrders)

export default OrderRouter;