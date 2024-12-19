import Joi from "joi";

export const pricingValidation = Joi.object({
	entityType: Joi.string().required(),
	entityId: Joi.number().required(),
	minQty: Joi.number().required(),
	maxQty: Joi.number().optional(),
	price: Joi.number().required(),
});

export const addPricing = Joi.array().items(pricingValidation);
