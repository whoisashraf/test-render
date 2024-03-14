import express from 'express';
import { Request, Response } from 'express';
import UserRouter from './users/routes';
import PostRouter from './post/routes';
import ProductRouter from "./product/router";
import CartRouter from "./cart/router";
import StoreRouter from "./store/router"
import WishlistRouter from "./wishlist/routes"
import CategoryRouter from './category/route';
import OrderRouter from './order/routes';

const Router = express.Router();

Router.use('/healthcheck', (req: Request, res: Response) => res.sendStatus(200))

//Routes
Router.use('/user', UserRouter);
Router.use('/post', PostRouter);
Router.use("/product", ProductRouter);
Router.use("/category", CategoryRouter);
Router.use("/cart", CartRouter);
Router.use("/store", StoreRouter);
Router.use("/wishlist", WishlistRouter);
Router.use("/order", OrderRouter);

export default Router;