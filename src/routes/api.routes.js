import express from "express";
import { changeFlagController, createCategoryController, deletedController, favouriteController, findCategoryByIdController, listCategoryController, listDisableCategoryController, updateCategoryController } from "../controllers/category.controller.js";
import productController from "../controllers/product.controller.js";
import componentController from "../controllers/component.controller.js";
import qualityController from "../controllers/quality.controller.js";
import serviceController from "../controllers/service.controller.js";
import upload from "../middlewares/multer.middleware.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import sizeController from "../controllers/size.controller.js";
import pricingController from "../controllers/pricing.controller.js";
import promotionController from "../controllers/promotion.controller.js";
import companyController from "../controllers/company.controller.js";

export const apiRouter = express.Router();

// Middleware AUTH

// API Categories
apiRouter.post("/categories", verifyToken, createCategoryController);
apiRouter.get("/categories", verifyToken, listCategoryController);
apiRouter.get("/categories/disabled", verifyToken, listDisableCategoryController);
apiRouter.get("/categories/:categoryId", verifyToken, findCategoryByIdController);
apiRouter.put("/categories/:categoryId", verifyToken, updateCategoryController);
apiRouter.patch("/categories/:categoryId", verifyToken, changeFlagController);
apiRouter.patch("/categories/:categoryId/fav", verifyToken, favouriteController);
apiRouter.delete("/categories/:categoryId", verifyToken, deletedController);

// API Products
// !TODO Update Feature Disable List, Favourite, Disabled
apiRouter.post("/products", verifyToken, upload.array("images"), productController.createController);
apiRouter.get("/products", verifyToken, productController.listController);

apiRouter.get("/products/disabled", verifyToken, productController.listDisabledController);
apiRouter.post("/products/category/create", verifyToken, productController.createCategoryProductController);
apiRouter.post("/products/services/create", verifyToken, productController.createServiceProductController);
apiRouter.post("/products/create/images/:barcode", verifyToken, upload.single("images"), productController.createImagesProductController);

apiRouter.patch("/products/update/:barcode", verifyToken, productController.updateProductController);
apiRouter.patch("/products/update/cover/:barcode", verifyToken, upload.single("images"), productController.updateCoverProductController);
apiRouter.patch("/products/update/images/:barcode/:id", verifyToken, upload.single("images"), productController.updateImagesProductController);
apiRouter.delete("/products/delete/images/:barcode/:id", verifyToken, productController.deleteImagesProductController);

apiRouter.patch("/products/update/category/:barcode/:categoryId/", verifyToken, productController.updateCategoryProductController);
apiRouter.patch("/products/update/service/:barcode/:barcodeService", verifyToken, productController.updateServiceProductController);

apiRouter.delete("/products/delete/category/:barcode/:categoryId/", verifyToken, productController.deleteCategoryProductController);
apiRouter.delete("/products/delete/services/:barcode/:barcodeService/", verifyToken, productController.deleteServicesProductController);
apiRouter.get("/products/components", verifyToken, productController.listComponentsProductsController);
apiRouter.post("/products/components/:barcode", verifyToken, productController.addComponentProductController);
apiRouter.get("/products/categories", verifyToken, productController.listCategoriesProductsController);
apiRouter.get("/products/services", verifyToken, productController.listServiceProductsController);
apiRouter.get("/products/:barcode", verifyToken, productController.detailController);
apiRouter.patch("/products/:barcode", verifyToken, productController.changeFlagController);
apiRouter.patch("/products/:barcode/favourite", verifyToken, productController.favouriteController);
apiRouter.delete("/products/:barcode", verifyToken, productController.deletedController);

// API Components
apiRouter.post("/components", verifyToken, componentController.createController);
apiRouter.get("/components", verifyToken, componentController.listController);
apiRouter.get("/components/disabled", verifyToken, componentController.listDisabledController);
apiRouter.get("/components/:componentId", verifyToken, componentController.findByIdController);
apiRouter.put("/components/:componentId", verifyToken, componentController.updateController);
apiRouter.patch("/components/:componentId", verifyToken, componentController.disabledController);
apiRouter.delete("/components/:componentId", verifyToken, componentController.deletedController);

// API Qualities
apiRouter.post("/qualities/:componentId", verifyToken, qualityController.createController);
apiRouter.delete("/qualities/:componentId/:qualityId", verifyToken, qualityController.deletedController);

apiRouter.put("/components/qualities/:componentId/:qualityId", verifyToken, qualityController.updateController);

// API Pricings
apiRouter.post("/pricings", verifyToken, pricingController.createController);
apiRouter.get("/pricings/:entityId/:entityType", verifyToken, pricingController.listController);
apiRouter.delete("/pricings/:id", verifyToken, pricingController.deletedController);

// API Sizes
// apiRouter.post(
// 	"/sizes/pricings",
// 	verifyToken,
// 	pricingController.addPricingSizeController
// );
apiRouter.post("/sizes", verifyToken, sizeController.createController);
apiRouter.get("/sizes", verifyToken, sizeController.listController);
apiRouter.post("/sizes/quality", verifyToken, sizeController.addToQualityController);
apiRouter.delete("/sizes/quality/:qualitySizeId", verifyToken, sizeController.deletedOnQualityController);
apiRouter.get("/sizes/:sizeId", verifyToken, sizeController.detailController);
apiRouter.put("/sizes/:sizeId", verifyToken, sizeController.updateController);
// apiRouter.get(
// 	"/sizes/quality/:qualityId",
// 	verifyToken,
// 	pricingController.getSizeFromQualityController
// );

// apiRouter.put(
// 	"/components/sizes/:qualityId/:sizeId",
// 	verifyToken,
// 	qualityController.updateSizeController
// );
// apiRouter.delete(
// 	"/components/sizes/:qualityId/:sizeId",
// 	verifyToken,
// 	qualityController.deletedSizeController
// );

// API Services

apiRouter.get("/services", verifyToken, serviceController.listController);
apiRouter.get("/services/disabled", verifyToken, serviceController.listDisabledController);
apiRouter.post("/services", verifyToken, serviceController.createController);
apiRouter.get("/services/:barcode", verifyToken, serviceController.detailController);
apiRouter.put("/services/:barcode", verifyToken, serviceController.updateController);
apiRouter.delete("/services/:barcode", verifyToken, serviceController.deletedController);
apiRouter.delete("/services/:barcode/:categoryId", verifyToken, serviceController.deleteCategoriesServiceController);
apiRouter.patch("/services/:barcode", verifyToken, serviceController.changeFlagController);
apiRouter.patch("/services/:barcode/favourite", verifyToken, serviceController.favouriteController);

// Promotion
apiRouter.get("/promotions", promotionController.listController);
apiRouter.post("/promotions", promotionController.createController);
apiRouter.put("/promotions/:code", promotionController.updateController);
apiRouter.delete("/promotions/:code", promotionController.deletedController);

// Company
apiRouter.get("/companies/:code", verifyToken, companyController.getController);
apiRouter.put("/companies/:code", verifyToken, companyController.updateController);
apiRouter.post("/companies/:code/social-media", verifyToken, companyController.addSocialMediaController);

apiRouter.put("/companies/:id/social-media", verifyToken, companyController.updateSocialMediaController);

apiRouter.delete("/companies/:id/social-media", verifyToken, companyController.deletedSocialMediaController);
