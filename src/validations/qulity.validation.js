import Joi from "joi";

export const qualitySizeValidation = Joi.array().items({
	name: Joi.string().max(100).required(),
	image: Joi.string().max(100).optional().allow(""),
	orientation: Joi.boolean().valid(true, false),
	sizes: Joi.array().items(
		Joi.object({
			width: Joi.number().optional(),
			height: Joi.number().optional(),
			weight: Joi.number().optional(),
			price: Joi.number().optional(),
			cogs: Joi.number().optional(),
			image: Joi.string().max(100).optional().allow(""),
		})
	),
});
