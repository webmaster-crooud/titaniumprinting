import Joi from "joi";

export const promotionValidation = Joi.object({
	code: Joi.string().min(5).max(20).required().uppercase().alphanum(),
	price: Joi.number().optional(),
	percent: Joi.number().optional(),
	banner: Joi.string().optional().allow(""),
	description: Joi.string().optional().allow("").max(1000),
	start: Joi.date().required(),
	end: Joi.date().required(),
});
