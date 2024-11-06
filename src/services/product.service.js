import slug from "slug";
import {
	getBarcodeValidation,
	productValidation,
} from "../validations/product.validation.js";
import { validate } from "../validations/validation.js";
import { prisma } from "../app/database.js";
import { ResponseError } from "../errors/Response.error.js";

// !TODOS Update all methods
const list = async () => {
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
			totalCogs: true,
			totalPrice: true,
			product_category: {
				select: {
					categories: {
						select: {
							name: true,
						},
					},
				},
			},
			service_product: {
				select: {
					services: {
						select: {
							name: true,
						},
					},
				},
			},
			flag: true,
			createdAt: true,
			updatedAt: true,
		},
		orderBy: {
			updatedAt: "desc",
		},
	});

	return result;
};
const listDisabled = async () => {
	const result = await prisma.product.findMany({
		where: {
			flag: "DISABLED",
		},
		select: {
			barcode: true,
			name: true,
			totalCogs: true,
			totalPrice: true,
			product_category: {
				select: {
					categories: {
						select: {
							name: true,
						},
					},
				},
			},
			flag: true,
			createdAt: true,
			updatedAt: true,
		},
		orderBy: {
			updatedAt: "desc",
		},
	});

	return result;
};
const create = async (request) => {
	console.log(request);
	request = validate(productValidation, request);

	let slugged;
	if (!slugged || slugged === "" || slugged === null) {
		slugged = slug(request.name);
	} else {
		slugged = request.slug;
	}

	console.log(slugged);
	const countProduct = await prisma.product.count({
		where: {
			slug: slugged,
		},
	});
	if (countProduct !== 0) throw new ResponseError(400, "Product is exist");

	const result = await prisma.$transaction(async (tx) => {
		try {
			const product = await tx.product.create({
				data: {
					name: request.name,
					slug: slugged,
					cover: request.cover,
					description: request.description,
				},
				select: {
					barcode: true,
					name: true,
					createdAt: true,
					updatedAt: true,
				},
			});

			const images = await tx.image.createMany({
				data: (request.images || []).map((image) => ({
					barcode: product.barcode,
					name: image.name,
					source: image.source,
				})),
				skipDuplicates: true,
			});

			const categoryProduct = await tx.categoryProduct.createMany({
				data: (request.categoryProduct || []).map((category) => ({
					barcode: product.barcode,
					categoryId: category.categoryId,
				})),
				skipDuplicates: true,
			});
			const serviceProduct = await tx.serviceProduct.createMany({
				data: (request.serviceProduct || []).map((service) => ({
					barcodeService: service.barcodeService,
					barcodeProduct: product.barcode,
				})),
			});

			const productComponent = await tx.productComponent.createMany({
				data: (request.productComponent || []).map((component) => ({
					barcode: product.barcode,
					componentId: component.componentId,
					minQty: component.minQty,
				})),
				skipDuplicates: true,
			});

			return {
				product,
				images,
				categoryProduct,
				productComponent,
				serviceProduct,
			};
		} catch (error) {
			throw new ResponseError(400, error);
		}
	});

	if (!result) throw new ResponseError(400, "Opsss... something wrong!");
	return result;
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
			cover: true,
			images: {
				select: {
					name: true,
					source: true,
				},
			},
			product_category: {
				select: {
					categories: {
						select: {
							name: true,
						},
					},
				},
			},
			service_product: {
				select: {
					services: {
						select: {
							name: true,
						},
					},
				},
				where: {
					services: {
						flag: "ACTIVED",
					},
				},
			},
			product_detail: {
				where: {
					component: {
						flag: "ACTIVED",
					},
				},
				select: {
					minQty: true,
					typePieces: true,
					component: {
						select: {
							name: true,
							price: true,
							cogs: true,
							canIncrise: true,
							typeComponent: true,
							qualities: {
								where: {
									flag: "ACTIVED",
								},
								select: {
									name: true,
									orientation: true,
									sizes: {
										select: {
											price: true,
											cogs: true,
											width: true,
											height: true,
											length: true,
											weight: true,
										},
									},
								},
							},
						},
					},
				},
			},
			totalCogs: true,
			totalPrice: true,
			flag: true,
			createdAt: true,
			updatedAt: true,
		},
	});

	if (!result) throw new ResponseError(404, "Product is not found");
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

const listComponents = async () => {
	return await prisma.component.findMany({
		where: {
			OR: [
				{
					flag: "ACTIVED",
				},
				{
					flag: "FAVOURITE",
				},
			],
		},
		select: {
			id: true,
			name: true,
			typeComponent: true,
		},
	});
};
const listCategories = async () => {
	return await prisma.category.findMany({
		where: {
			OR: [
				{
					flag: "ACTIVED",
				},
				{
					flag: "FAVOURITE",
				},
			],
		},
		select: {
			id: true,
			name: true,
		},
	});
};
const listService = async () => {
	return await prisma.service.findMany({
		where: {
			OR: [
				{
					flag: "ACTIVED",
				},
				{
					flag: "FAVOURITE",
				},
			],
		},
		select: {
			name: true,
			barcode: true,
		},
	});
};

export default {
	create,
	findByBarcode,
	list,
	listDisabled,
	update,
	listComponents,
	listCategories,
	listService,
};
