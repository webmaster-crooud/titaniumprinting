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
import serviceController from "../controllers/service.controller.js";
import upload from "../middlewares/multer.middleware.js";

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
apiRouter.post(
	"/products",
	upload.array("images"),
	productController.createController
);
apiRouter.get("/products", productController.listController);

apiRouter.get("/products/disabled", productController.listDisabledController);
apiRouter.post(
	"/products/category/create",
	productController.createCategoryProductController
);
apiRouter.post(
	"/products/services/create",
	productController.createServiceProductController
);
apiRouter.post(
	"/products/create/images/:barcode",
	upload.single("images"),
	productController.createImagesProductController
);

apiRouter.patch(
	"/products/update/:barcode",
	productController.updateProductController
);
apiRouter.patch(
	"/products/update/cover/:barcode",
	upload.single("images"),
	productController.updateCoverProductController
);
apiRouter.patch(
	"/products/update/images/:barcode/:id",
	upload.single("images"),
	productController.updateImagesProductController
);
apiRouter.delete(
	"/products/delete/images/:barcode/:id",
	productController.deleteImagesProductController
);

apiRouter.patch(
	"/products/update/category/:barcode/:categoryId/",
	productController.updateCategoryProductController
);
apiRouter.patch(
	"/products/update/service/:barcode/:barcodeService",
	productController.updateServiceProductController
);

apiRouter.delete(
	"/products/delete/category/:barcode/:categoryId/",
	productController.deleteCategoryProductController
);
apiRouter.delete(
	"/products/delete/services/:barcode/:barcodeService/",
	productController.deleteServicesProductController
);
apiRouter.get(
	"/products/components",
	productController.listComponentsProductsController
);
apiRouter.get(
	"/products/categories",
	productController.listCategoriesProductsController
);
apiRouter.get(
	"/products/services",
	productController.listServiceProductsController
);
apiRouter.get("/products/:barcode", productController.detailController);
apiRouter.patch("/products/:barcode", productController.changeFlagController);
apiRouter.patch(
	"/products/:barcode/favourite",
	productController.favouriteController
);
apiRouter.delete("/products/:barcode", productController.deletedController);

// API Components
apiRouter.post("/components", componentController.createController);
apiRouter.get("/components", componentController.listController);
apiRouter.get(
	"/components/disabled",
	componentController.listDisabledController
);
apiRouter.get(
	"/components/:componentId",
	componentController.findByIdController
);
apiRouter.put("/components/:componentId", componentController.updateController);
apiRouter.patch(
	"/components/:componentId",
	componentController.disabledController
);
apiRouter.delete(
	"/components/:componentId",
	componentController.deletedController
);

// API Qualities
apiRouter.post(
	"/components/qualities/:componentId",
	qualityController.createController
);
apiRouter.put(
	"/components/qualities/:componentId/:qualityId",
	qualityController.updateController
);
apiRouter.delete(
	"/components/qualities/:componentId/:qualityId",
	qualityController.deletedController
);

// API Sizes
apiRouter.put(
	"/components/sizes/:qualityId/:sizeId",
	qualityController.updateSizeController
);
apiRouter.delete(
	"/components/sizes/:qualityId/:sizeId",
	qualityController.deletedSizeController
);

// API Services
apiRouter.get("/services", serviceController.listController);
apiRouter.get("/services/disabled", serviceController.listDisabledController);
apiRouter.post("/services", serviceController.createController);
apiRouter.get("/services/:barcode", serviceController.detailController);
apiRouter.put("/services/:barcode", serviceController.updateController);
apiRouter.delete("/services/:barcode", serviceController.deletedController);
apiRouter.delete(
	"/services/:barcode/:categoryId",
	serviceController.deleteCategoriesServiceController
);
apiRouter.patch("/services/:barcode", serviceController.changeFlagController);
apiRouter.patch(
	"/services/:barcode/favourite",
	serviceController.favouriteController
);