import express from "express";
import categoryController from "../controllers/app/category.controller.js";
import productController from "../controllers/app/product.controller.js";
import rajaongkirController from "../controllers/app/rajaongkir.controller.js";
import homeController from "../controllers/app/home.controller.js";
import cartController from "../controllers/app/cart.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import userController from "../controllers/app/user.controller.js";

export const appRoute = express.Router();

appRoute.get("/home", homeController.homeController);

appRoute.get("/categories", categoryController);

// Products
appRoute.get("/products", productController.listProductController);
appRoute.get("/products/:slug", productController.detailController);

// RAJA ONGKIR
appRoute.get("/rajaongkir/province", rajaongkirController.getProvices);
appRoute.get("/rajaongkir/city", rajaongkirController.getCities);
appRoute.post(
	"/rajaongkir/delivery/:from/:destination/:weight/:courier",
	rajaongkirController.getOngkir
);

// Cart & Promotion
appRoute.post("/promotions", cartController.generateCodePromotionController);
appRoute.post("/cart", verifyToken, cartController.createController);
//Midtrans
appRoute.post("/transaction", cartController.transactionController);

// Users
appRoute.get("/users/cart", verifyToken, userController.getCartController);
appRoute.delete(
	"/users/cart/:cartId",
	verifyToken,
	userController.deleteCartController
);
