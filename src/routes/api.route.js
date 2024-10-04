import express from "express";
import {
	changeFlagController,
	createCategoryController,
	deletedController,
	favouriteController,
	findCategoryByIdController,
	listCategoryController,
	listDisableCategoryController,
	updateCategoryController,
} from "../controllers/category.controller.js";
import productController from "../controllers/product.controller.js";
import componentController from "../controllers/component.controller.js";
import qualityController from "../controllers/quality.controller.js";

export const apiRouter = express.Router();

// API Categories
apiRouter.post("/categories", createCategoryController);
apiRouter.get("/categories", listCategoryController);
apiRouter.get("/categories/disabled", listDisableCategoryController);
apiRouter.get("/categories/:categoryId", findCategoryByIdController);
apiRouter.put("/categories/:categoryId", updateCategoryController);
apiRouter.patch("/categories/:categoryId", changeFlagController);
apiRouter.patch("/categories/:categoryId/fav", favouriteController);
apiRouter.delete("/categories/:categoryId", deletedController);

// API Products
// !TODO Update Feature Disable List, Favourite, Disabled
apiRouter.post("/products", productController.createController);
apiRouter.get("/products", productController.listController);
apiRouter.get("/products/:barcode", productController.detailController);
apiRouter.put("/products/:barcode", productController.updateController);

// API Components
apiRouter.post("/components", componentController.createController);

// API Qualities
apiRouter.post("/components/qualities/:componentId", qualityController.createController);
