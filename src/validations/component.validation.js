import Joi from "joi";

export const componentValidation = Joi.object({
	name: Joi.string().min(5).max(100).required(),
	image: Joi.string().min(5).max(100).optional().allow(""),
	typePieces: Joi.string().max(100).optional().allow(""),
	qtyPieces: Joi.number().max(100).required(),
	price: Joi.number().max(100).optional(),
	cogs: Joi.number().max(100).optional(),
	canIncrase: Joi.boolean().optional().allow(""),
	typeComponent: Joi.string().max(100).required(),
});

// export const sizeValidation = Joi.object({

// });

// export const componentHasQualityValidation = Joi.object({
// 	name: Joi.string().min(5).max(100).required(),
// 	image: Joi.string().min(5).max(100).optional().allow(""),
// 	typePieces: Joi.string().max(100).optional().allow(""),
// 	qtyPieces: Joi.number().max(100).required(),
// 	price: Joi.number().max(100).optional().allow(""),
// 	cogs: Joi.number().max(100).optional().allow(""),
// 	canIncrase: Joi.boolean().optional().allow(""),
// 	typeComponent: Joi.string().max(100).required(),
// 	quality: Joi.array()
// 		.items(
// 			Joi.object({
// 				componentId: Joi.string().required(),
// 				qualityName: Joi.string().max(100).required(),
// 				size: Joi.array()
// 					.items(
// 						Joi.object({
// 							qualityId: Joi.number().required(),
// 						})
// 					)
// 					.optional(),
// 			})
// 		)
// 		.optional(),
// });

export const getComponentValidation = Joi.string().min(5).max(100).required();
