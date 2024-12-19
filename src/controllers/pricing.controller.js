import { ResponseError } from "../errors/Response.error.js";
import pricingService from "../services/pricing.service.js";

const createController = async (req, res, next) => {
	const request = req.body;
	try {
		await pricingService.create(request);
		res.status(200).json({
			message: "OK",
		});
	} catch (error) {
		next(error);
	}
};

const listController = async (req, res, next) => {
	const { entityType, entityId } = req.params;
	if (!entityId) throw new ResponseError(400, "Entity ID is not defined");
	if (!entityType) throw new ResponseError(400, "Entity ID is not defined");
	try {
		const result = await pricingService.list(parseInt(entityId), entityType);
		res.status(200).json({
			message: "ok",
			data: result,
		});
	} catch (error) {
		next(error);
	}
};

const deletedController = async (req, res, next) => {
	const { id } = req.params;
	if (!id) throw new ResponseError(400, "Id is not defined");
	try {
		await pricingService.deleted(parseInt(id));
		res.status(201).json({
			message: "Successfully deleted progressive pricing",
		});
	} catch (error) {
		next(error);
	}
};
export default {
	createController,
	listController,
	deletedController,
};
