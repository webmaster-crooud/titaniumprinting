import qualityService from "../services/quality.service.js";

const createController = async (req, res, next) => {
	try {
		const data = await qualityService.create(req.body, req.params.componentId);
		res.status(201).json({
			error: false,
			message: "OK",
			data,
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
	try {
		const reqParams = req.params;
		await qualityService.deletedQuality(reqParams);
		res.status(201).json({
			error: false,
			message: `Successfully to deleted quality and size data`,
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
