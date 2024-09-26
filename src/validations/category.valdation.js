import Joi from "joi";

export const categoryValidation = Joi.object({
	name: Joi.string().min(5).max(100).required(),
	slug: Joi.string().min(5).max(100).optional(),
	description: Joi.string().max(300).optional(),
});

export const getCategoryValidation = Joi.number().required();
