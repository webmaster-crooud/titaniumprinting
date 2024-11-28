import express from "express";
import categoryController from "../controllers/app/category.controller.js";
import productController from "../controllers/app/product.controller.js";
import rajaongkirController from "../controllers/app/rajaongkir.controller.js";

export const appRoute = express.Router();

appRoute.get("/categories", categoryController);

// Products
appRoute.get("/products/:slug", productController.detailController);

// RAJA ONGKIR
appRoute.get("/rajaongkir/province", rajaongkirController.getProvices);
appRoute.get("/rajaongkir/city", rajaongkirController.getCities);
appRoute.post(
	"/rajaongkir/delivery/:from/:destination/:weight/:courier",
	rajaongkirController.getOngkir
);
