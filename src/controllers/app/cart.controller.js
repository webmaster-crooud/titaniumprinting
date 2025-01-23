import Midtrans from "midtrans-client";
import { ResponseError } from "../../errors/Response.error.js";
import cartService from "../../services/app/cart.service.js";
import dotenv from "dotenv";
dotenv.config();
dotenv.config({ path: ".env.production" });
const generateCodePromotionController = async (req, res, next) => {
	try {
		const { code } = req.body;
		if (!code) throw new ResponseError(400, "Code is undefined!");
		const data = await cartService.generateCodePromotion(code);
		res.status(200).json({
			message: "Successfully to get the promotion",
			data,
		});
	} catch (error) {
		next(error);
	}
};

const createController = async (req, res, next) => {
	const email = req.email;
	if (!email) throw new ResponseError(400, "Email is not defined!");
	try {
		await cartService.create(req.body, email);
		res.status(201).json({
			message: "Successfully to create add new Cart",
		});
	} catch (error) {
		next(error);
	}
};

const transactionController = async (req, res, next) => {
	const snap = new Midtrans.Snap({
		isProduction: false,
		serverKey: process.env.MIDTRANS_SERVER_KEY,
		clientKey: process.env.MIDTRANS_CLIENT_KEY,
	});

	try {
		const request = req.body;
		const result = await cartService.transaction(request);

		// Prepare item details
		const itemsData = prepareItemDetails(result);
		console.log("Items Data:", itemsData);

		// Calculate gross amount from item details
		const calculatedGrossAmount = calculateGrossAmount(itemsData);
		console.log("Calculated Gross Amount:", calculatedGrossAmount);

		// Prepare customer details
		const customerDetails = prepareCustomerDetails(result, request);

		// Prepare transaction parameters
		const params = {
			transaction_details: {
				order_id: result.createTransaction.transactionCode,
				gross_amount: calculatedGrossAmount, // Gunakan calculatedGrossAmount
			},
			item_details: itemsData,
			customer_details: customerDetails,
		};

		// Create transaction with Midtrans
		const transaction = await snap.createTransaction(params);

		// Send success response
		res.status(201).json({
			message: "Successfully created Transaction",
			data: {
				transaction: result.createTransaction,
				payment: {
					token: transaction.token,
					redirect_url: transaction.redirect_url,
				},
			},
		});
	} catch (error) {
		next(error);
	}
};

// Helper function to limit string length
const limitStringLength = (str, maxLength = 50) => {
	return str.length > maxLength ? str.substring(0, maxLength) : str;
};

// Helper function to calculate gross amount
const calculateGrossAmount = (items) => {
	return items.reduce((total, item) => total + item.price * item.quantity, 0);
};

// Helper function to prepare item details
const prepareItemDetails = (result) => {
	const itemsData = [];

	// Add main product
	itemsData.push(
		createItem(
			result.createCart.id,
			result.createCart.copies,
			result.createCart.product.name,
			result.createCart.subTotalPrice,
			result.createCart.product.product_category
				.map((categories) => categories.categories.name)
				.join(", "),
			`${process.env.APP_FRONTEND}/produk/${result.createCart.product.slug}`
		)
	);

	// Add shipping cost
	itemsData.push(
		createItem(
			result.createTransaction.delivery.id,
			1,
			`Jasa Pengiriman ${result.createTransaction.delivery.courier} ${result.createTransaction.delivery.service}`,
			result.createTransaction.delivery.price,
			result.createTransaction.delivery.service,
			`${process.env.APP_FRONTEND}/produk/${result.createCart.product.slug}`
		)
	);

	// Add discount (if applicable)
	if (result.createTransaction.promotionCode) {
		itemsData.push(
			createItem(
				result.createTransaction.promotionCode,
				1,
				`Diskon ${result.createTransaction.promotionCode}`,
				-result.discountPrice || 0,
				"Promotion",
				`${process.env.APP_FRONTEND}/produk/${result.createCart.product.slug}`
			)
		);
	}

	return itemsData;
};

// Helper function to create an item
const createItem = (id, quantity, name, price, category, url) => {
	return {
		id,
		quantity: parseInt(quantity), // Pastikan quantity adalah integer
		name: limitStringLength(name),
		brand: limitStringLength("Titanium Printing"),
		price: parseInt(price), // Pastikan price adalah integer
		category: limitStringLength(category),
		merchant_name: limitStringLength("Titanium Printing"),
		url,
	};
};

// Helper function to prepare customer details
const prepareCustomerDetails = (result, request) => {
	const customer = result.createCustomer;
	const address = request.customer.address;

	return {
		first_name: limitStringLength(customer.firstName),
		last_name: limitStringLength(customer.lastName),
		email: customer.email,
		phone: customer.phone,
		billing_address: createAddress(customer, address),
		shipping_address: createAddress(customer, address),
	};
};

// Helper function to create an address
const createAddress = (customer, address) => {
	return {
		first_name: limitStringLength(customer.firstName),
		last_name: limitStringLength(customer.lastName),
		email: customer.email,
		phone: customer.phone,
		address: limitStringLength(address.street),
		city: limitStringLength(address.city),
		postal_code: address.postalCode,
		country_code: "IDN",
	};
};

export default {
	generateCodePromotionController,
	createController,
	transactionController,
};
