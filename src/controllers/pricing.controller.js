import { ResponseError } from "../errors/Response.error.js";
import pricingService from "../services/pricing.service.js";

const addPricingQualityController = async (req, res, next) => {
	const request = req.body;
	console.log(request);
	try {
		await pricingService.addPricingQuality(request);
		res.status(200).json({
			message: "OK",
		});
	} catch (error) {
		next(error);
	}
};

const addPricingSizeController = async (req, res, next) => {
	const request = req.body;
	console.log(request);
	try {
		await pricingService.addPricingSize(request);
		res.status(200).json({
			message: "OK",
		});
	} catch (error) {
		next(error);
	}
};

const getSizeFromQualityController = async (req, res, next) => {
	const { qualityId } = req.params;
	console.log(qualityId);
	if (!qualityId) throw new ResponseError(400, "Quality ID is not defined");
	try {
		const result = await pricingService.getSizeFromQuality(parseInt(qualityId));
		res.status(200).json({
			message: "OK",
			data: result,
		});
	} catch (error) {
		next(error);
	}
};

export default {
	addPricingQualityController,
	addPricingSizeController,
	getSizeFromQualityController,
};
