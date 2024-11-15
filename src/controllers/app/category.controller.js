import categoryService from "../../services/app/category.service.js";

const listController = async (req, res, next) => {
	try {
		const result = await categoryService.list();
		res.status(200).json({
			message: "successfully get list of category",
			data: result,
		});
	} catch (err) {
		next(err);
	}
};

export default listController;
