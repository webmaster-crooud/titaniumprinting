import Joi from "joi";

export const productValidation = Joi.object({
	name: Joi.string().min(5).max(100).required(),
	slug: Joi.string().min(5).max(100).optional().allow(""),
	category_id: Joi.number().required(),
	image: Joi.string().optional().allow(""),
	description: Joi.string().max(1000).optional().allow(""),
});

export const getBarcodeValidation = Joi.string().required();
