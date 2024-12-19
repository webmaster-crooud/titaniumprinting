import { ResponseError } from "../errors/Response.error.js";
import promotionService from "../services/promotion.service.js";

const createController = async (req, res, next) => {
	const request = req.body;

	try {
		const result = await promotionService.create(request);
		res.status(201).json({
			message: `Successfully to create promotion ${result.code}`,
		});
	} catch (error) {
		next(error);
	}
};

const listController = async (req, res, next) => {
	try {
		const result = await promotionService.list();
		res.status(200).json({
			message: "OK",
			data: result,
		});
	} catch (error) {
		next(error);
	}
};

const updateController = async (req, res, next) => {
	const { code } = req.params;
	const request = req.body;

	if (!code) throw new ResponseError(400, "Code is not defined!");
	try {
		const result = await promotionService.update(code, request);
		res.status(201).json({
			message: `Successfully to update ${result.code}`,
		});
	} catch (error) {
		next(error);
	}
};

const deletedController = async (req, res, next) => {
	const { code } = req.params;
	if (!code) throw new ResponseError(400, "Code is not defined!");
	try {
		await promotionService.deleted(code);
		res.status(201).json({
			message: "Successfully to deleted promotion",
		});
	} catch (error) {
		next(error);
	}
};

export default {
	createController,
	listController,
	updateController,
	deletedController,
};
