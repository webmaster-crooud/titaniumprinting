import slug from "slug";
import { getBarcodeValidation, productValidation } from "../validations/product.validation.js";
import { validate } from "../validations/validation.js";
import { prisma } from "../app/database.js";
import { ResponseError } from "../errors/Response.error.js";

const create = async (request) => {
	request = validate(productValidation, request);
	if (request.slug === undefined) {
		request.slug = slug(request.name);
	} else {
		request.slug = slug(request.slug);
	}

	const countProduct = await prisma.product.count({
		where: {
			slug: request.slug,
		},
	});

	if (countProduct != 0) throw new ResponseError(400, "Product with this slug is exist");

	return await prisma.product.create({
		data: {
			name: request.name,
			slug: request.slug,
			image: request.image,
			description: request.description,
			category: {
				connect: {
					id: request.category_id,
				},
			},
		},
		select: {
			barcode: true,
			name: true,
			slug: true,
			category: {
				select: {
					name: true,
				},
			},
			description: true,
			image: true,
			flag: true,
			createdAt: true,
			updatedAt: true,
		},
	});
};

const findByBarcode = async (barcode) => {
	barcode = validate(getBarcodeValidation, barcode);
	const result = await prisma.product.findFirst({
		where: {
			OR: [
				{
					barcode: barcode,
					flag: "ACTIVED",
				},
				{
					barcode: barcode,
					flag: "FAVOURITE",
				},
			],
		},
		select: {
			barcode: true,
			name: true,
			slug: true,
			description: true,
			category: {
				select: {
					name: true,
				},
			},
			flag: true,
			image: true,
			createdAt: true,
			updatedAt: true,
		},
	});

	if (!result) throw new ResponseError(404, "Product is not found");
	return result;
};

const list = async (page = 1, limit = 10) => {
	const result = await prisma.product.findMany({
		where: {
			OR: [
				{
					flag: "ACTIVED",
				},
				{ flag: "FAVOURITE" },
			],
		},
		select: {
			barcode: true,
			name: true,
			image: true,
			category: {
				select: {
					name: true,
				},
			},
			flag: true,
			createdAt: true,
			updatedAt: true,
		},
		skip: (page - 1) * limit,
		take: limit,
		orderBy: {
			updatedAt: "desc",
		},
	});

	return result;
};

const update = async (barcode, request) => {
	request = validate(productValidation, request);

	const findProduct = await prisma.product.findFirst({
		where: {
			OR: [
				{ barcode: barcode, flag: "ACTIVED" },
				{ barcode: barcode, flag: "FAVOURITE" },
			],
		},
		select: {
			barcode: true,
		},
	});

	if (!findProduct) throw new ResponseError(404, "Products is not found");
	return await prisma.product.update({
		where: {
			barcode: findProduct.barcode,
		},
		data: {
			name: request.name,
			image: request.image,
			description: request.description,
			category: {
				connect: {
					id: request.category_id,
				},
			},
		},

		select: {
			barcode: true,
			slug: true,
			name: true,
			image: true,
			category: {
				select: {
					name: true,
				},
			},
			flag: true,
			createdAt: true,
			updatedAt: true,
		},
	});
};

export default {
	create,
	findByBarcode,
	list,
	update,
};
