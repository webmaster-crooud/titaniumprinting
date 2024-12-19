import Joi from "joi";

export const companyValidation = Joi.object({
	name: Joi.string().min(1).max(100).required(),
	logo: Joi.string().min(1).max(100).required(),
	description: Joi.string().allow("").max(1000).optional(),

	street: Joi.string().max(100).required(),
	city: Joi.string().max(100).optional().allow(""),
	province: Joi.string().max(100).optional().allow(""),
	country: Joi.string().max(100).optional().allow(""),
	postalCode: Joi.string().max(10).required(),
});

export const socialMediaValidation = Joi.array().items({
	name: Joi.string().max(100).required(),
	url: Joi.string().max(100).required(),
});
