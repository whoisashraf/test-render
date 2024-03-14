import { omit, get } from "lodash";
import log from "../logger";
import { Request, Response } from "express";
import {
  findCategory,
  findAndUpdate,
  deleteCategory,
  createCategory,
  findAllCategory,
} from "../service/categories/cartegory.service";

export const createCategoryHandler = async (req: Request, res: Response) => {

    try {

        const userId = get(req, "user._id");
        let body = get(req, "body");
        let { name } = body;

        const categoryExist = await findCategory({ name });

        if(categoryExist) return res.status(409).json({
          status: 409,
          message: "Category already exist",
        });

        body.createdBy = userId;

        const category = await createCategory({ ...body })

        return res.status(201).json({
          status: 201,
          category
        });

    } catch (err) {
        log.error(err);
        return res.status(500).json({
          status: 500,
          message: "Ops something went wrong. Please try again later!!",
        });
    }
}


export const updateCategoryHandler = async (req: Request, res: Response) => {

    try {
        const userId = get(req, "user._id");
        let body = req.body;


        delete body.createdBy
        const updateCategory = await findAndUpdate({ _id: body.categoryId }, { ...body}, { new: true})
        
        return res.status(201).json({
          status: 201,
          category: updateCategory
        });
    } catch (err) {
        log.error(err);
        return res.status(500).json({
          status: 500,
          message: "Ops something went wrong. Please try again later!!",
        });
    }
}

export const findSingleCategoryHandler = async (req: Request, res: Response) => {

    try {
      const categoryId = get(req, "params.id");
      const category = await findCategory({_id: categoryId, deleted: false})
      
      return res.status(201).json({
        status: 201,
        category
      });
        
    } catch (err) {
        log.error(err);
        return res.status(500).json({
          status: 500,
          message: "Ops something went wrong. Please try again later!!",
        });
    }
}

export const findAllHandler = async (req: Request, res: Response) => {

    try {

      const category = await findAllCategory({  deleted: false })

      return res.status(201).json({
        status: 201,
        category,
      });

    } catch (err) {
        log.error(err);
        return res.status(500).json({
          status: 500,
          message: "Ops something went wrong. Please try again later!!",
        });
    }
}

export const deleteCategoryHandler = async (req: Request, res: Response) => {

    try {
        
      const categoryId = get(req, "params.id");
      const category = await findAndUpdate({_id: categoryId}, { $set : {deleted: true} }, {new:true})

      return res.status(201).json({
        status: 201,
        message: "category deleted successfully",
        category
      });
    } catch (err) {
        log.error(err);
        return res.status(500).json({
          status: 500,
          message: "Ops something went wrong. Please try again later!!",
        });
    }
}

