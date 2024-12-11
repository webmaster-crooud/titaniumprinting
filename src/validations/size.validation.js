import Joi from "joi";

export const sizeValidation = Joi.object({
	name: Joi.string().required().min(1).max(100).label("Ukuran"),
	length: Joi.number().required().label("Panjang"),
	width: Joi.number().required().label("Lebar"),
	height: Joi.number()
		.optional()
		.allow("" | 0)
		.label("Tinggi"),
	weight: Joi.number().required().label("Berat"),
});

export const createSizeValidation = Joi.array().items(sizeValidation);

export const getSizeValidation = Joi.number().required();
