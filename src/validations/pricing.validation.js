import Joi from "joi";

export const pricingValidation = Joi.object({
	componentId: Joi.number().required(),
	qualityId: Joi.number().optional(),
	sizeId: Joi.number().optional(),
	price: Joi.number().required().min(1),
	cogs: Joi.number().required().min(1),
});

export const addPricing = Joi.array().items(pricingValidation);
