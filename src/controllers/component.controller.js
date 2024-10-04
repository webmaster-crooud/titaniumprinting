import componentService from "../services/component.service.js";

const createController = async (req, res, next) => {
	try {
		const data = await componentService.create(req.body);
		res.status(201).json({
			error: false,
			message: "Successfully",
			data,
		});
	} catch (error) {
		next(error);
	}
};

export default { createController };
