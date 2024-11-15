import { ResponseError } from "../../errors/Response.error.js";
import productService from "../../services/app/product.service.js";

const detailController = async (req, res, next) => {
	try {
		const slug = req.params.slug;
		if (!slug) throw new ResponseError(400, "Bad request...");
		const result = await productService.detail(slug);
		res.status(200).json({
			data: result,
		});
	} catch (error) {
		next(error);
	}
};

export default { detailController };
