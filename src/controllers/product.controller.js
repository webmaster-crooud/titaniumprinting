import { prisma } from "../app/database.js";
import { ResponseError } from "../errors/Response.error.js";
import productService from "../services/product.service.js";

import path from "path";
import { promises as fs } from "fs";
import { fileURLToPath } from "url";
import { logger } from "../app/logger.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const listController = async (req, res, next) => {
	try {
		const result = await productService.list();
		res.status(200).json({
			error: false,
			message: "Successfully to get list data product",
			data: result,
		});
	} catch (error) {
		next(error);
	}
};
const listDisabledController = async (req, res, next) => {
	try {
		const result = await productService.listDisabled();
		res.status(200).json({
			error: false,
			message: "Successfully to get list data product",
			data: result,
		});
	} catch (error) {
		next(error);
	}
};
const createController = async (req, res, next) => {
	try {
		// console.log(req.body.data);
		const request = JSON.parse(req.body.data);
		await productService.create(request);

		res.status(201).json({
			error: false,
			message: "Successfully to create new Product",
			// data: result,
		});
	} catch (error) {
		next(error);
	}
};
const detailController = async (req, res, next) => {
	try {
		const result = await productService.findByBarcode(req.params.barcode);

		res.status(200).json({
			error: false,
			message: "Successfully to get product detail",
			data: result,
		});
	} catch (error) {
		next(error);
	}
};
const listComponentsProductsController = async (req, res, next) => {
	try {
		const result = await productService.listComponents();
		res.status(200).json({
			error: false,
			message: "Successfully to get data list components",
			data: result,
		});
	} catch (error) {
		next(error);
	}
};
const listCategoriesProductsController = async (req, res, next) => {
	try {
		const result = await productService.listCategories();
		res.status(200).json({
			error: false,
			message: "Successfully to get data list categories",
			data: result,
		});
	} catch (error) {
		next(error);
	}
};
const listServiceProductsController = async (req, res, next) => {
	try {
		const result = await productService.listService();
		res.status(200).json({
			error: false,
			message: "Successfully to get data list categories",
			data: result,
		});
	} catch (error) {
		next(error);
	}
};
const changeFlagController = async (req, res, next) => {
	try {
		const barcode = req.params.barcode;
		const result = await productService.changeFlag(barcode);

		res.status(201).json({
			error: false,
			message: `Successfully to ${result.flag} Product ${result.name}`,
		});
	} catch (error) {
		next(error);
	}
};
const favouriteController = async (req, res, next) => {
	try {
		const barcode = req.params.barcode;
		const result = await productService.favourite(barcode);
		// console.log(result);
		res.status(201).json({
			error: false,
			message: `Successfully to ${result.flag} Product ${result.name}`,
		});
	} catch (error) {
		next(error);
	}
};
const deletedController = async (req, res, next) => {
	try {
		const barcode = req.params.barcode;
		// Retrieve product details to delete associated files
		if (!barcode || typeof barcode !== "string" || barcode.trim() === "") {
			throw new ResponseError(400, "Invalid barcode");
		}

		const product = await prisma.product.findUnique({
			where: { barcode },
			select: { cover: true, images: true },
		});

		if (!product) {
			throw new ResponseError(404, "Product not found");
		}

		try {
			// Delete cover image file
			if (product.cover) {
				await fs.unlink(path.join(__dirname, "../../public/cover/", product.cover));
			}

			// Delete multiple image files
			await Promise.all(
				product.images.map(async (image) => {
					await fs.unlink(path.join(__dirname, "../../public/images/", image.source));
				})
			);
		} catch (error) {
			logger.error("Error deleting files:", error);
			throw new ResponseError(500, "Failed to delete files");
		}

		await productService.deleted(barcode);
		res.status(201).json({
			error: false,
			message: `Successfully to deleted this products`,
		});
	} catch (error) {
		next(error);
	}
};

const updateProductController = async (req, res, next) => {
	try {
		const barcode = req.params.barcode;
		// console.log(barcode);
		const request = req.body;
		const result = await productService.updateProduct(barcode, request);
		res.status(201).json({
			error: false,
			message: `Successfully updated ${result.name}!`,
		});
	} catch (error) {
		next(error);
	}
};

const updateCategoryProductController = async (req, res, next) => {
	try {
		const params = req.params;
		const request = req.body;
		const result = await productService.updateCategoryProduct(params, request);
		res.status(201).json({
			error: false,
			message: `Successfully to update category to ${result.categories.name}`,
		});
	} catch (error) {
		next(error);
	}
};
const createCategoryProductController = async (req, res, next) => {
	try {
		const request = req.body;
		const result = await productService.createCategoryProduct(request);
		res.status(201).json({
			error: false,
			message: `Successfully to add new category ${result.categories.name}`,
		});
	} catch (error) {
		next(error);
	}
};

const deleteCategoryProductController = async (req, res, next) => {
	try {
		const params = req.params;
		await productService.deleteCategoryProduct(params);
		res.status(201).json({
			error: false,
			message: `Successfully to dekete category`,
		});
	} catch (error) {
		next(error);
	}
};

const updateServiceProductController = async (req, res, next) => {
	try {
		const params = req.params;
		const request = req.body;
		const result = await productService.updateServiceProduct(params, request);
		res.status(201).json({
			error: false,
			message: `Successfully to update category to ${result.services.name}`,
		});
	} catch (error) {
		next(error);
	}
};

const createServiceProductController = async (req, res, next) => {
	try {
		const request = req.body;
		const result = await productService.createServiceProduct(request);
		res.status(201).json({
			error: false,
			message: `Successfully to add new services ${result.services.name}`,
		});
	} catch (error) {
		next(error);
	}
};

const deleteServicesProductController = async (req, res, next) => {
	try {
		const params = req.params;
		await productService.deleteServiceProduct(params);
		res.status(201).json({
			error: false,
			message: `Successfully to delete service`,
		});
	} catch (error) {
		next(error);
	}
};

const updateCoverProductController = async (req, res, next) => {
	try {
		const barcode = req.params.barcode;
		// Retrieve product details to delete associated files
		if (!barcode || typeof barcode !== "string" || barcode.trim() === "") {
			throw new ResponseError(400, "Invalid barcode");
		}

		const product = await prisma.product.findUnique({
			where: { barcode },
			select: { cover: true },
		});

		if (!product) {
			throw new ResponseError(404, "Product not found");
		}

		// try {
		// 	// Delete cover image file
		// 	if (product.cover) {
		// 		await fs.unlink(path.join(__dirname, "../../public/cover/", product.cover));
		// 	}
		// } catch (error) {
		// 	logger.error("Error deleting files:", error);
		// 	throw new ResponseError(500, "Failed to delete files");
		// }

		const request = JSON.parse(req.body.data);
		await productService.updateCoverProduct(barcode, request);
		res.status(201).json({
			error: false,
			message: `Successfully to update cover this products`,
		});
	} catch (error) {
		next(error);
	}
};
const updateImagesProductController = async (req, res, next) => {
	try {
		const barcode = req.params.barcode;
		const id = parseInt(req.params.id);
		// Retrieve product details to delete associated files
		if (!barcode || typeof barcode !== "string" || barcode.trim() === "") {
			throw new ResponseError(400, "Invalid barcode");
		}

		const images = await prisma.image.findFirst({
			where: { barcode: barcode, id: id },
			select: { source: true },
		});

		if (!images) {
			throw new ResponseError(404, "Images not found");
		}

		try {
			// Delete cover image file
			if (images.source) {
				await fs.unlink(path.join(__dirname, "../../public/images/", images.source));
			}
		} catch (error) {
			logger.error("Error deleting files:", error);
			throw new ResponseError(500, "Failed to delete files");
		}

		const request = JSON.parse(req.body.data);
		await productService.updateImagesProduct(barcode, id, request);
		res.status(201).json({
			error: false,
			message: `Successfully to update images this products`,
		});
	} catch (error) {
		next(error);
	}
};

const deleteImagesProductController = async (req, res, next) => {
	try {
		const barcode = req.params.barcode;
		const id = parseInt(req.params.id);
		// Retrieve product details to delete associated files
		if (!barcode || typeof barcode !== "string" || barcode.trim() === "") {
			throw new ResponseError(400, "Invalid barcode");
		}

		const images = await prisma.image.findFirst({
			where: { barcode: barcode, id: id },
			select: { source: true },
		});

		if (!images) {
			throw new ResponseError(404, "Images not found");
		}

		try {
			// Delete cover image file
			if (images.source) {
				await fs.unlink(path.join(__dirname, "../../public/images/", images.source));
			}
		} catch (error) {
			logger.error("Error deleting files:", error);
			throw new ResponseError(500, "Failed to delete files");
		}

		await productService.deleteImagesProduct(barcode, id);
		res.status(201).json({
			error: false,
			message: `Successfully to delete images this products`,
		});
	} catch (error) {
		next(error);
	}
};

const createImagesProductController = async (req, res, next) => {
	try {
		const barcode = req.params.barcode;
		const request = JSON.parse(req.body.data);
		await productService.createImagesProduct(barcode, request);
		res.status(201).json({
			error: false,
			message: `Successfully to add new images this products`,
		});
	} catch (error) {
		next(error);
	}
};

const addComponentProductController = async (req, res, next) => {
	try {
		const { barcode } = req.params;
		await productService.addComponentProduct(barcode, req.body);
		res.status(201).json({
			message: "Component has Successfully adding in Product",
		});
	} catch (error) {
		next(error);
	}
};
const deleteComponentProductController = async (req, res, next) => {
	try {
		const { barcode, componentId } = req.params;
		await productService.deleteComponentProduct(barcode, componentId);
		res.status(201).json({
			message: "Component has Successfully deleted from Product",
		});
	} catch (error) {
		next(error);
	}
};
export default {
	createController,
	detailController,
	listController,
	listDisabledController,
	listComponentsProductsController,
	listCategoriesProductsController,
	listServiceProductsController,
	changeFlagController,
	favouriteController,
	deletedController,
	updateProductController,
	updateCategoryProductController,
	createCategoryProductController,
	deleteCategoryProductController,
	updateServiceProductController,
	createServiceProductController,
	deleteServicesProductController,
	updateCoverProductController,
	updateImagesProductController,
	deleteImagesProductController,
	createImagesProductController,
	addComponentProductController,
	deleteComponentProductController,
};
