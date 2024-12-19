import Joi from "joi";

export const serviceValidation = Joi.object({
	name: Joi.string().min(5).max(100).required(),
	slug: Joi.string().min(5).max(100).optional().allow(""),
});

export const getServiceValidation = Joi.string().min(5).max(100).required();
