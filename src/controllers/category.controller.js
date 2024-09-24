import categoryService from "../services/category.service.js";

export const createCategoryController = async (req, res, next) => {
	try {
		const result = await categoryService.create(req.body);
		res.status(201).json({
			message: "Successfully created new category",
			data: result,
		});
	} catch (error) {
		next(error);
	}
};
