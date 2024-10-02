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
