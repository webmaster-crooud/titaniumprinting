import { ResponseError } from "../errors/Response.error.js";
import qualityService from "../services/quality.service.js";

const createController = async (req, res, next) => {
	const { componentId } = req.params;
	if (!componentId) throw new ResponseError(400, "Component ID is not defined");
	try {
		await qualityService.create(req.body, parseInt(req.params.componentId));
		res.status(201).json({
			message: "Successfully to create new qualities",
		});
	} catch (error) {
		next(error);
	}
};

const updateController = async (req, res, next) => {
	try {
		const reqParams = req.params;
		const requestBody = req.body;
		// console.log(requestBody);
		const result = await qualityService.updateQuality(reqParams, requestBody);

		res.status(201).json({
			error: false,
			message: "Successfully to update quality " + result.name,
		});
	} catch (error) {
		next(error);
	}
};

const deletedController = async (req, res, next) => {
	const { componentId, qualityId } = req.params;
	console.log(componentId);
	console.log(qualityId);
	try {
		if (!componentId && !qualityId) throw new ResponseError(400, "Bad Request");
		await qualityService.deletedQuality(
			parseInt(componentId),
			parseInt(qualityId)
		);
		res.status(201).json({
			error: false,
			message: `Successfully to deleted quality`,
		});
	} catch (error) {
		next(error);
	}
};

const updateSizeController = async (req, res, next) => {
	try {
		const reqParams = req.params;
		const reqBody = req.body;
		const result = await qualityService.updateSize(reqParams, reqBody);
		res.status(201).json({
			error: false,
			message: "Successfully to update size " + result.id,
		});
	} catch (error) {
		next(error);
	}
};

const deletedSizeController = async (req, res, next) => {
	try {
		const result = await qualityService.deleteSize(req.params);
		res.status(201).json({
			error: false,
			message: "Successfully to deleted " + result.id,
		});
	} catch (error) {
		next(error);
	}
};

export default {
	createController,
	updateController,
	deletedController,
	updateSizeController,
	deletedSizeController,
};
