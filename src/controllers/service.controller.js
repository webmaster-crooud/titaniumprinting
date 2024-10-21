import serviceService from "../services/service.service.js";
const createController = async (req, res, next) => {
	try {
		const result = await serviceService.create(req.body);
		res.status(201).json({
			error: false,
			message: `Successfully to create ${result.name}`,
		});
	} catch (error) {
		next(error);
	}
};

const detailController = async (req, res, next) => {
	try {
		const result = await serviceService.detail(req.params.barcode);
		res.status(200).json({
			error: false,
			status: "OK",
			data: result,
		});
	} catch (error) {
		next(error);
	}
};

const updateController = async (req, res, next) => {
	try {
		const request = req.body;
		const barcode = req.params.barcode;
		const result = await serviceService.update(barcode, request);
		res.status(201).json({
			error: false,
			message: `Successfully to updated ${result.name} service's`,
		});
	} catch (error) {
		next(error);
	}
};

const listController = async (req, res, next) => {
	try {
		const result = await serviceService.list();
		res.status(200).json({
			error: false,
			message: "Successfully to get list Services",
			data: result,
		});
	} catch (error) {
		next(error);
	}
};

const listDisabledController = async (req, res, next) => {
	try {
		const result = await serviceService.listDisabled();
		res.status(200).json({
			error: false,
			message: "Successfully to get list disabled Services",
			data: result,
		});
	} catch (error) {
		next(error);
	}
};

const deletedController = async (req, res, next) => {
	try {
		const result = await serviceService.deleted(req.params.barcode);
		res.status(201).json({
			error: false,
			message: `Successfully to deleted Service`,
		});
	} catch (error) {
		next(error);
	}
};

const changeFlagController = async (req, res, next) => {
	try {
		const result = await serviceService.changeFlag(req.params.barcode);
		res.status(201).json({
			error: false,
			message: `Successfully to make ${result.name} ${result.flag}`,
		});
	} catch (error) {
		next(error);
	}
};

const favouriteController = async (req, res, next) => {
	try {
		const result = await serviceService.favourite(req.params.barcode);
		res.status(201).json({
			error: false,
			message: `Successfully to make ${result.name} ${result.flag}`,
		});
	} catch (error) {
		next(error);
	}
};

export default {
	createController,
	detailController,
	updateController,
	listController,
	listDisabledController,
	deletedController,
	changeFlagController,
	favouriteController,
};
