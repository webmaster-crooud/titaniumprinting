import productService from "../services/product.service.js";

const createController = async (req, res, next) => {
	try {
		const result = await productService.create(req.body);
		console.log(result);
		res.status(201).json({
			error: false,
			message: "Successfully to create new Product",
			data: result,
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

const listController = async (req, res, next) => {
	try {
		const page = 1;
		const limit = 10;
		const result = await productService.list(page, limit);
		res.status(200).json({
			error: false,
			message: "Successfully to get list data product",
			data: result,
			page: page,
			limit: limit,
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

export default {
	createController,
	detailController,
	listController,
	updateController,
};
