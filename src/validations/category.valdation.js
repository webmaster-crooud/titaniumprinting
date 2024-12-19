import Joi from "joi";

export const categoryValidation = Joi.object({
	name: Joi.string().min(1).max(100).required(),
	slug: Joi.string().min(1).max(100).optional(),
	description: Joi.string().max(1000).optional().allow(""),
});

export const getCategoryValidation = Joi.number().required();
