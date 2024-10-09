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

const listController = async (req, res, next) => {
	try {
		const result = await componentService.list();
		res.status(200).json({
			error: false,
			message: "Successfully get list components",
			data: result,
		});
	} catch (error) {
		next(error);
	}
};

const listDisabledController = async (req, res, next) => {
	try {
		const result = await componentService.listDisabled();
		res.status(200).json({
			error: false,
			message: "Successfully get list components Disabled",
			data: result,
		});
	} catch (error) {
		next(error);
	}
};

const findByIdController = async (req, res, next) => {
	try {
		const result = await componentService.findById(req.params.componentId);
		res.status(200).json({
			error: false,
			message: `Success to get ${result.name} Component`,
			data: result,
		});
	} catch (error) {
		next(error);
	}
};

const updateController = async (req, res, next) => {
	try {
		const requestBody = req.body;
		const componentId = req.params.componentId;
		const result = await componentService.update(componentId, requestBody);

		res.status(201).json({
			error: false,
			message: `Successfully to update ${result.name}`,
			data: result,
		});
	} catch (error) {
		next(error);
	}
};

const disabledController = async (req, res, next) => {
	try {
		const result = await componentService.disabled(req.params.componentId);
		res.status(201).json({
			error: false,
			message: `Successfully to ${result.flag} component ${result.name}`,
		});
	} catch (error) {
		next(error);
	}
};

const deletedController = async (req, res, next) => {
	try {
		await componentService.deleted(req.params.componentId);
		res.status(201).json({
			error: false,
			message: "Successfully to deleted component",
		});
	} catch (error) {
		next(error);
	}
};

export default {
	createController,
	listController,
	findByIdController,
	updateController,
	disabledController,
	deletedController,
	listDisabledController,
};
