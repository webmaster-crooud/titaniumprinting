import qualityService from "../services/quality.service.js";

const createController = async (req, res, next) => {
	try {
		const data = await qualityService.create(req.params.componentId, req.body);
		res.status(201).json({
			error: false,
			message: "OK",
			data,
		});
	} catch (error) {
		next(error);
	}
};

export default { createController };
