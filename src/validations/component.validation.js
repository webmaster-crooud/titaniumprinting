import Joi from "joi";

export const qualityValidation = Joi.object({
	name: Joi.string().min(1).required().max(100),
	price: Joi.number().optional().allow(""),
	cogs: Joi.number().optional().allow(""),
});

export const componentValidation = Joi.object({
	name: Joi.string().min(1).required(),
	typeComponent: Joi.string().required(),
	qualities: Joi.array().items(qualityValidation).optional(),
	price: Joi.number().optional().allow(""),
	cogs: Joi.number().optional().allow(""),
});

// export const pricingsValidation = Joi.object({
// 	componentId: Joi.number().required(),
// 	qualityId: Joi.number().optional(),
// 	sizeId: Joi.number().optional(),
// 	price: Joi.number().required(),
// 	cogs: Joi.number().required(),
// });
// export const sizeValidation = Joi.object({
// 	name: Joi.string().required().min(1).max(100),
// 	width: Joi.number().required(),
// 	length: Joi.number().required(),
// 	height: Joi.number().required(),
// 	weight: Joi.number().required(),
// });

export const detailComponentValidation = Joi.required();
