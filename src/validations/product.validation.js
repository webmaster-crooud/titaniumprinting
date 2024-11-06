import Joi from "joi";

export const productValidation = Joi.object({
	name: Joi.string().min(5).max(100).required(),
	slug: Joi.string().min(5).max(100).optional().allow(""),
	cover: Joi.string().optional().allow(""),
	description: Joi.string().max(1000).optional().allow(""),
	totalPrice: Joi.number().optional().allow(null),
	totalCogs: Joi.number().optional().allow(null),
	images: Joi.array().items({
		name: Joi.string().max(100).required(),
		source: Joi.string().max(100).required(),
	}),
	categoryProduct: Joi.array().items({
		categoryId: Joi.number().required(),
	}),
	productComponent: Joi.array().items({
		componentId: Joi.string().max(100).required(),
		minQty: Joi.number().optional().allow(null),
		typePieces: Joi.string().optional().allow(""),
	}),
	serviceProduct: Joi.array().items({
		barcodeService: Joi.string().max(100).required(),
	}),
});

export const getBarcodeValidation = Joi.string().required();
