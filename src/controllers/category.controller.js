import categoryService from "../services/category.service.js";

export const createCategoryController = async (req, res, next) => {
	try {
		const result = await categoryService.create(req.body);
		res.status(201).json({
			error: false,
			message: "Successfully created new category",
			data: result,
		});
	} catch (error) {
		next(error);
	}
};

export const findCategoryByIdController = async (req, res, next) => {
	try {
		const result = await categoryService.findById(req.params.categoryId);
		res.status(200).json({
			error: false,
			message: "Successfully get category",
			data: result,
		});
	} catch (err) {
		next(err);
	}
};

export const updateCategoryController = async (req, res, next) => {
	try {
		const categoryId = req.params.categoryId;
		const request = req.body;
		const result = await categoryService.update(categoryId, request);
		res.status(201).json({
			error: false,
			message: "Successfully update a category",
			data: result,
		});
	} catch (error) {
		next(error);
	}
};

export const changeFlagController = async (req, res, next) => {
	try {
		const result = await categoryService.changeFlag(req.params.categoryId);
		res.status(200).json({
			error: false,
			message: `Category ${result.name} successfully to ${result.flag}`,
		});
	} catch (error) {
		next(error);
	}
};

export const listCategoryController = async (req, res, next) => {
	try {
		const page = req.query.page || 1;
		const limit = 10;
		const result = await categoryService.listActive(page, limit);
		res.status(200).json({
			error: false,
			message: "OK",
			data: result,
			page: page,
			limit: limit,
		});
	} catch (error) {
		next(error);
	}
};

export const favouriteController = async (req, res, next) => {
	try {
		const result = await categoryService.isFavourite(req.params.categoryId);
		res.status(201).json({
			error: false,
			message: `${result.name} is ${result.flag}`,
			data: result,
		});
	} catch (error) {
		next(error);
	}
};

export const deletedController = async (req, res, next) => {
	try {
		const result = await categoryService.deleted(req.params.categoryId);
		res.status(201).json({
			error: false,
			message: `Successfully to delete category ${result.name}`,
		});
	} catch (error) {
		next(error);
	}
};
