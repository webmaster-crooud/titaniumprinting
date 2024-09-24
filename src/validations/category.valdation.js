import Joi from "joi";

export const createCategoryValidation = Joi.object({
	name: Joi.string().min(5).max(100).required(),
	slug: Joi.string().min(5).max(100).optional(),
});
