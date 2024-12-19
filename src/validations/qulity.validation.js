import Joi from "joi";
export const sizeValidation = Joi.object({
	name: Joi.string().min(1).max(100).optional().allow(""),
	width: Joi.number().optional(),
	length: Joi.number().optional(),
	height: Joi.number().optional(),
	weight: Joi.number().optional(),
	price: Joi.number().optional(),
	cogs: Joi.number().optional(),
});

export const qualitySizeValidation = Joi.object({
	name: Joi.string().max(100).required(),
	qualitiesSize: Joi.array().items({
		sizeId: Joi.number().required(),
		price: Joi.number().required(),
		cogs: Joi.number().required(),
	}),
});

export const qualityValidation = Joi.object({
	name: Joi.string().max(100).required(),
	price: Joi.number().optional(),
	cogs: Joi.number().optional(),
});

export const getQualityValidation = Joi.number().required();
export const getSizeValidation = Joi.number().required();
