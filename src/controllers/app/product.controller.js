import { ResponseError } from "../../errors/Response.error.js";
import productService from "../../services/app/product.service.js";

const detailController = async (req, res, next) => {
	try {
		const { slug } = req.params;
		console.log(slug);
		if (!slug) throw new ResponseError(400, "Bad request...");
		const result = await productService.detail(slug);
		console.log(result);
		res.status(200).json({
			data: result,
		});
	} catch (error) {
		next(error);
	}
};

const listProductController = async (req, res, next) => {
	const { search } = req.query;
	try {
		const result = await productService.listProduct(search);
		res.status(200).json({
			message: "ok",
			data: result,
		});
	} catch (error) {
		next(error);
	}
};

export default { detailController, listProductController };
