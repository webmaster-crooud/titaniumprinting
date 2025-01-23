import Joi from "joi";

// Validation for CartItem
const cartItemValidation = Joi.object({
	componentName: Joi.string().required().max(100),
	qualityName: Joi.string().optional().allow("").max(100),
	sizeName: Joi.string().optional().allow("").max(100),
	qty: Joi.number().required().min(1),
	price: Joi.number().required().min(0),
	cogs: Joi.number().required().min(0),
	totalPrice: Joi.number().required().min(0),
	totalCogs: Joi.number().required().min(0),
	weight: Joi.number().required().min(0),
});

// Validation for logged-in users (only email is required)
export const saveCartValidation = Joi.object({
	email: Joi.string().required().email().max(100),
	notes: Joi.string().optional().allow("").max(1000),
	copies: Joi.number().required().min(1),
	productId: Joi.string().required().max(100),
	subTotalPrice: Joi.number().required().min(0),
	totalWeight: Joi.number().required().min(0),
	cartItems: Joi.array().items(cartItemValidation).required(),
});

export const deliveryValidation = Joi.object({
	from: Joi.string().required().max(100),
	destination: Joi.string().required().max(100),
	weight: Joi.number().required().min(1),
	courier: Joi.string().required().max(100),
	code: Joi.string().optional().allow("").max(100),
	etd: Joi.string().required().max(100),
	service: Joi.string().required().max(100),
	price: Joi.number().required().min(1),
});

export const addressValidation = Joi.object({
	street: Joi.string().required().max(100),
	city: Joi.string().required().max(100),
	cityId: Joi.string().required().max(100),
	province: Joi.string().required().max(100),
	country: Joi.string().optional().allow("").max(100),
	postalCode: Joi.string().required().max(100),
	building: Joi.string().required().max(100),
	name: Joi.string().optional().allow("").max(100),
});

export const customerValidation = Joi.object({
	email: Joi.string().required().email().max(100),
	firstName: Joi.string().required().max(100),
	lastName: Joi.string().required().max(100),
	phone: Joi.string().required().max(100),
	address: addressValidation,
});

export const userValidation = Joi.object({
	email: Joi.string().required().email().max(100),
	addressId: Joi.number().required().max(100),
});
export const transactionValidation = Joi.object({
	notes: Joi.string().optional().allow("").max(1000),
	copies: Joi.number().required().min(1),
	productId: Joi.string().required().max(100),
	subTotalPrice: Joi.number().required().min(0),
	totalWeight: Joi.number().required().min(0),
	finalTotalCogs: Joi.number().required().min(0),
	finalTotalPrice: Joi.number().required().min(0),
	promotionCode: Joi.string().optional().allow("").max(100),
	cartItems: Joi.array().items(cartItemValidation).required(),
	delivery: deliveryValidation.optional(),
	customer: customerValidation.optional(),
	user: userValidation.optional().allow(),
});
