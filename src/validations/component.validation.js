import Joi from "joi";

export const componentValidation = Joi.object({
	name: Joi.string().min(5).required(),
	image: Joi.string().min(5).optional().allow(""),
	typePieces: Joi.string().optional().allow(""),
	qtyPieces: Joi.number().required(),
	price: Joi.number().optional(),
	cogs: Joi.number().optional(),
	canIncrase: Joi.boolean().optional(),
	typeComponent: Joi.string().required(),
});

export const getComponentValidation = Joi.string().required();
