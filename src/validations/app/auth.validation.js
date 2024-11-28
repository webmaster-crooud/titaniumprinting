import Joi from "joi";

export const registerValidation = Joi.object({
	firstName: Joi.string()
		.alphanum()
		.min(1)
		.max(100)
		.required()
		.label("First Name"),
	lastName: Joi.string().min(1).max(100).optional().allow(""),
	email: Joi.string().email().min(5).max(100).required(),
	password: Joi.string().min(8).max(100).required(),
});

export const emailVerifyValidation = Joi.object({
	email: Joi.string().email().required(),
	token: Joi.string().uuid().min(1).required(),
});

export const loginValidation = Joi.object({
	email: Joi.string().email().optional().allow(""),
	username: Joi.string().min(1).max(100).optional().allow(""),
	password: Joi.string().min(8).max(100).required(),
});
