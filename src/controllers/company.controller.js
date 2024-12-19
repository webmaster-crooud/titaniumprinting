import { ResponseError } from "../errors/Response.error.js";
import companyService from "../services/company.service.js";

const updateController = async (req, res, next) => {
	const { code } = req.params;
	const request = req.body;
	console.log({
		code: code,
		...request,
	});
	if (!code) throw new ResponseError(400, "Code Company is not defined");
	try {
		const result = await companyService.update(code, request);
		res.status(201).json({
			message: `Successfully to update ${result.name} company profile`,
		});
	} catch (error) {
		next(error);
	}
};

const addSocialMediaController = async (req, res, next) => {
	const { code } = req.params;
	const request = req.body;
	if (!code) throw new ResponseError(400, "Code Company is not defined");
	try {
		const result = await companyService.addSocialMedia(code, request);
		res.status(201).json({
			message: `Successfully to add new ${result.count} Social Media`,
		});
	} catch (error) {
		next(error);
	}
};

const updateSocialMediaController = async (req, res, next) => {
	const request = req.body;
	const { id } = req.params;
	if (!id) throw new ResponseError(400, "ID Social Media is not defined!");
	try {
		const result = await companyService.updateSocialMedia(id, request);
		res.status(201).json({
			message: `Successfully to update ${result.name} Socail Media`,
		});
	} catch (error) {
		next(error);
	}
};

const deletedSocialMediaController = async (req, res, next) => {
	const { id } = req.params;
	if (!id) throw new ResponseError(400, "ID Social Media is not defined!");
	try {
		await companyService.deletedSocialMedia(parseInt(id));
		res.status(201).json({
			message: "Successfully to deleted Social Media",
		});
	} catch (error) {
		next(error);
	}
};

const getController = async (req, res, next) => {
	const { code } = req.params;
	if (!code) throw new ResponseError(400, "Code Company is not defined!");
	try {
		const result = await companyService.get(code);
		res.status(200).json({
			message: "ok",
			data: result,
		});
	} catch (error) {
		next(error);
	}
};

export default {
	updateController,
	addSocialMediaController,
	updateSocialMediaController,
	deletedSocialMediaController,
	getController,
};
