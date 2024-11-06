import productService from "../services/product.service.js";

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
		console.log("File: " + req.files);
		console.log("request: " + request);
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

const updateController = async (req, res, next) => {
	try {
		const barcode = req.params.barcode;
		const request = req.body;
		const result = await productService.update(barcode, request);

		res.status(201).json({
			error: false,
			message: "Successfully to updating this product",
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

export default {
	createController,
	detailController,
	listController,
	listDisabledController,
	listComponentsProductsController,
	updateController,
	listCategoriesProductsController,
	listServiceProductsController,
};
