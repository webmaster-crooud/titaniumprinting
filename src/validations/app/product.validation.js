import Joi from "joi";

export const getSlugProduct = Joi.string().min(1).max(100).required();
