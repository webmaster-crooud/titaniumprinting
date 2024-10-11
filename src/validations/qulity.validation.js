import Joi from "joi";
export const sizeValidation = Joi.object({
	width: Joi.number().optional(),
	height: Joi.number().optional(),
	weight: Joi.number().optional(),
	price: Joi.number().optional(),
	cogs: Joi.number().optional(),
	image: Joi.string().max(100).optional().allow(""),
});

export const qualitySizeValidation = Joi.object({
	name: Joi.string().max(100).required(),
	image: Joi.string().max(100).optional().allow(""),
	orientation: Joi.boolean().valid(true, false),
	sizes: Joi.array().items(sizeValidation),
});

export const qualityValidation = Joi.object({
	name: Joi.string().max(100).required(),
	image: Joi.string().max(100).optional().allow(""),
	orientation: Joi.boolean().valid(true, false),
});

export const getQualityValidation = Joi.number().required();
export const getSizeValidation = Joi.number().required();
