import { ResponseError } from "../errors/Response.error.js";
import sizeService from "../services/size.service.js";

const createController = async (req, res, next) => {
	try {
		const reqBody = req.body;
		const result = await sizeService.create(reqBody);
		res.status(201).json({
			message: "Successfully to create new Size",
			data: result,
		});
	} catch (error) {
		next(error);
	}
};

const listController = async (req, res, next) => {
	try {
		const result = await sizeService.list();
		res.status(200).json({
			message: "Successfully get list size",
			data: result,
		});
	} catch (error) {
		next(error);
	}
};

const detailController = async (req, res, next) => {
	const { sizeId } = req.params;
	try {
		const result = await sizeService.detail(sizeId);
		res.status(200).json({
			message: "Succcessfully to get " + result.name,
			data: result,
		});
	} catch (error) {
		next(error);
	}
};

const updateController = async (req, res, next) => {
	const request = req.body;
	const { sizeId } = req.params;
	try {
		const result = await sizeService.update(sizeId, request);
		res.status(201).json({
			message: `Succesffully to update ${result.name}`,
			data: result,
		});
	} catch (error) {
		next(error);
	}
};

const addToQualityController = async (req, res, next) => {
	const request = req.body;
	try {
		await sizeService.addToQuality(request);
		res.status(201).json({
			message: "OK",
		});
	} catch (error) {
		next(error);
	}
};

const deletedOnQualityController = async (req, res, next) => {
	const { qualitySizeId } = req.params;
	if (!qualitySizeId) throw new ResponseError(404, "Data is not found!");

	try {
		await sizeService.deletedOnQuality(parseInt(qualitySizeId));
		res.status(201).json({
			message: "Successfully deleted Size on Quality",
		});
	} catch (error) {
		next(error);
	}
};

export default {
	createController,
	listController,
	updateController,
	detailController,
	addToQualityController,
	deletedOnQualityController,
};
