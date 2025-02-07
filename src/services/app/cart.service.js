import Midtrans from "midtrans-client";
import { prisma } from "../../app/database.js";
import { ResponseError } from "../../errors/Response.error.js";
import { formatUnix } from "../../libs/moment.js";
import {
	saveCartValidation,
	transactionValidation,
} from "../../validations/app/cart.validation.js";
import { validate } from "../../validations/validation.js";
import dotenv from "dotenv";
dotenv.config();
dotenv.config({ path: ".env.production" });

const checkPromotionValidity = (start, end) => {
	const now = formatUnix(new Date()); // Waktu saat ini dalam timestamp
	start = formatUnix(start);
	end = formatUnix(end);

	if (now < start || now > end) {
		throw new ResponseError(
			400,
			now < start ? "Code is not yet valid!" : "Code has expired!"
		);
	}

	return true; // Jika valid, kembalikan true
};
const generateCodePromotion = async (code) => {
	// Check Code valid
	const find = await prisma.promotion.findUnique({
		where: {
			code: code,
		},
		select: {
			code: true,
			start: true,
			end: true,
		},
	});

	if (!find) throw new ResponseError(400, "Code is not valid!");

	checkPromotionValidity(find.start, find.end);
	return await prisma.promotion.findUnique({
		where: {
			code: find.code,
		},
	});
};

const create = async (request, email) => {
	request = validate(saveCartValidation, request);

	const checkProduct = await prisma.product.findUnique({
		where: {
			barcode: request.productId,
		},
		select: {
			barcode: true,
			name: true,
		},
	});
	if (!checkProduct) throw new ResponseError(400, "Product is not found!");
	// let checkPromotion;
	// if (request.promotionCode) {
	// 	checkPromotion = await prisma.promotion.findUnique({
	// 		where: {
	// 			code: request.promotionCode,
	// 		},
	// 		select: {
	// 			code: true,
	// 		},
	// 	});
	// 	if (!checkPromotion)
	// 		throw new ResponseError(400, "Code Promotion is not found!");
	// }

	const checkEmail = await prisma.user.findUnique({
		where: {
			email: email,
		},
		select: {
			email: true,
		},
	});
	if (!checkEmail) throw new ResponseError(400, "Email is not found!");
	const result = await prisma.$transaction(async (tx) => {
		const createCart = await tx.cart.create({
			data: {
				notes: request.notes,
				copies: request.copies,
				subTotalPrice: request.subTotalPrice,
				totalWeight: request.totalWeight,
				user: {
					connect: {
						email: checkEmail.email,
					},
				},
				product: {
					connect: {
						barcode: checkProduct.barcode,
					},
				},
			},
			select: {
				id: true,
			},
		});

		const cartItemsData = request.cartItems.map((item) => ({
			cartId: String(createCart.id), // Gunakan ID cart yang baru dibuat
			componentName: String(item.componentName),
			qualityName: String(item.qualityName),
			sizeName: String(item.sizeName),
			qty: item.qty,
			price: item.price,
			cogs: item.cogs,
			totalPrice: item.totalPrice,
			totalCogs: item.totalCogs,
			weight: item.weight,
		}));

		// Gunakan createMany untuk membuat beberapa CartItem sekaligus
		const createCartItem = await tx.cartItem.createMany({
			data: cartItemsData,
		});

		return { createCart, createCartItem };
	});

	if (!result) {
		throw new ResponseError(400, "Oppsss... something wrong!");
	} else {
		return result;
	}
};

const transaction = async (request) => {
	console.log(`REQUEST: ${request}`);
	request = validate(transactionValidation, request);
	console.log(`VALIDATE: ${request}`);
	const checkProduct = await prisma.product.findUnique({
		where: {
			barcode: request.productId,
		},
		select: {
			barcode: true,
			name: true,
		},
	});
	if (!checkProduct) throw new ResponseError(400, "Product is not found!");

	let checkPromotion;
	if (request.promotionCode) {
		checkPromotion = await prisma.promotion.findUnique({
			where: {
				code: request.promotionCode,
			},
			select: {
				code: true,
			},
		});
		if (!checkPromotion)
			throw new ResponseError(400, "Code Promotion is not found!");
	}

	const result = await prisma.$transaction(async (tx) => {
		const checkEmail = await prisma.user.findUnique({
			where: {
				email: request.customer.email,
			},
		});

		if (!checkEmail) {
			const createCustomer = await tx.user.create({
				data: {
					email: request.customer.email,
					firstName: request.customer.firstName,
					lastName: request.customer.lastName,
					phone: request.customer.phone,
					addresses: {
						create: {
							name: "Utama",
							street: request.customer.address.street,
							city: request.customer.address.city,
							cityId: request.customer.address.cityId,
							province: request.customer.address.province,
							country: request.customer.address.country || "Indonesia",
							postalCode: request.customer.address.postalCode,
							building: request.customer.address.building,
						},
					},
				},
				include: {
					addresses: true,
				},
			});
			console.log("CreateCustomer", createCustomer);
			const createCart = await tx.cart.create({
				data: {
					notes: request.notes,
					copies: request.copies,
					subTotalPrice: request.subTotalPrice,
					totalWeight: request.totalWeight,
					user: {
						connect: {
							email: createCustomer.email,
						},
					},
					product: {
						connect: {
							barcode: checkProduct.barcode,
						},
					},
				},
				include: {
					product: {
						include: {
							product_category: {
								include: {
									categories: {
										select: {
											name: true,
										},
									},
								},
							},
						},
					},
				},
			});
			const cartItemsData = request.cartItems.map((item) => ({
				cartId: String(createCart.id), // Gunakan ID cart yang baru dibuat
				componentName: String(item.componentName),
				qualityName: String(item.qualityName),
				sizeName: String(item.sizeName),
				qty: item.qty,
				price: item.price,
				cogs: item.cogs,
				totalPrice: item.totalPrice,
				totalCogs: item.totalCogs,
				weight: item.weight,
			}));
			// Gunakan createMany untuk membuat beberapa CartItem sekaligus
			await tx.cartItem.createMany({
				data: cartItemsData,
			});

			// Calculated for Transaction
			let promotionCode;
			if (request.promotionCode) {
				promotionCode = await tx.promotion.findFirst({
					where: {
						code: request.promotionCode,
					},
					select: {
						code: true,
						percent: true,
						price: true,
					},
				});
				if (!promotionCode)
					throw new ResponseError(400, "Promotion code is not valid!");
			}
			let discountPrice;
			let finalTotalPrice;
			if (request.promotionCode) {
				if (promotionCode.price) {
					discountPrice = promotionCode.price;
				} else if (promotionCode.percent) {
					discountPrice =
						(Number(promotionCode.percent) / 100) * createCart.subTotalPrice;
				}
				finalTotalPrice =
					Number(createCart.subTotalPrice) * Number(createCart.copies) +
					Number(request.delivery.price) -
					discountPrice;
			} else {
				finalTotalPrice =
					Number(createCart.subTotalPrice) + Number(request.delivery.price);
			}

			const createTransaction = await tx.transaction.create({
				data: {
					finalTotalCogs: request.finalTotalCogs,
					finalTotalPrice: finalTotalPrice,
					promotionCode: promotionCode.code || "",
					status: "PENDING",
					user: {
						connect: {
							email: createCustomer.email,
						},
					},
					cart: {
						connect: {
							id: createCart.id,
						},
					},
					delivery: {
						create: {
							code: request.delivery.code,
							courier: request.delivery.courier,
							destination: request.delivery.destination,
							etd: request.delivery.etd,
							from: request.delivery.from,
							price: request.delivery.price,
							service: request.delivery.service,
							weight: request.delivery.weight,
							weight: request.delivery.weight,
						},
					},
				},
				select: {
					promotionCode: true,
					transactionCode: true,
					finalTotalPrice: true,
					delivery: true,
				},
			});

			return { createTransaction, createCustomer, createCart, discountPrice };
		}
	});

	if (!result) {
		throw new ResponseError(400, "Oppsss... something wrong!");
	} else {
		return result;
	}
};

export default { generateCodePromotion, create, transaction };
