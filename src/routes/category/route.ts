import express from "express";
import multer from "multer";
import requiresAdmin from "../../middleware/validation/requireAdmin";
import requiresUser from "../../middleware/validation/requiresUser";

import {
    validate,
    createCategoryRules,
    updateCategoryRules,
} from "../../middleware/validation/validator";

import {
  findSingleCategoryHandler,
  findAllHandler,
  createCategoryHandler,
  updateCategoryHandler,
  deleteCategoryHandler
} from "../../controller/category.controller";

const upload = multer({ dest: 'uploads/'})

const CategoryRouter = express.Router();

CategoryRouter.get("/get/:id", findSingleCategoryHandler );
CategoryRouter.get("/get", findAllHandler);

CategoryRouter.use(requiresUser)
CategoryRouter.post("/create", createCategoryRules(), validate, createCategoryHandler);
CategoryRouter.post("/update", updateCategoryRules(), validate, updateCategoryHandler);

CategoryRouter.use(requiresAdmin)
CategoryRouter.delete("/delete/:id", deleteCategoryHandler);

export default CategoryRouter;