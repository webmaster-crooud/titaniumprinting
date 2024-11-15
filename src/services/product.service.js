import slug from "slug";
import {
	coverProductValidation,
	getBarcodeValidation,
	getCategoryProductValidation,
	getServiceProductValidation,
	imagesProductValidation,
	productUpdateValidation,
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
					typePieces: component.typePieces,
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
			name: true,
			slug: true,
			description: true,
			cover: true,

			images: {
				select: {
					id: true,
					name: true,
					source: true,
				},
			},
			product_category: {
				select: {
					categories: {
						select: {
							id: true,
							name: true,
						},
					},
				},
			},
			product_component: {
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
							id: true,
							name: true,
							price: true,
							cogs: true,
							canIncrise: true,
							description: true,
							typeComponent: true,
						},
					},
				},
			},
			service_product: {
				select: {
					services: {
						select: {
							barcode: true,
							name: true,
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
const changeFlag = async (barcode) => {
	barcode = validate(getBarcodeValidation, barcode);

	const product = await prisma.product.findUnique({
		where: {
			barcode: barcode,
		},
	});

	if (!product) throw new ResponseError(404, "Product is not found!");

	let newFlag = product.flag;
	if (newFlag === "ACTIVED" || newFlag === "FAVOURITE") {
		newFlag = "DISABLED";
	} else {
		newFlag = "ACTIVED";
	}
	return await prisma.product.update({
		where: {
			barcode: barcode,
		},
		data: {
			flag: newFlag,
		},
		select: {
			barcode: true,
			name: true,
			flag: true,
		},
	});
};
const favourite = async (barcode) => {
	barcode = validate(getBarcodeValidation, barcode);

	const product = await prisma.product.findFirst({
		where: {
			barcode: barcode,
		},
		select: {
			barcode: true,
			flag: true,
		},
	});

	console.log(product);

	if (product.flag === "DISABLED")
		throw new ResponseError(400, "Products is disabled");
	if (!product) throw new ResponseError(404, "Product is not found!");

	if (product.flag === "ACTIVED") {
		return await prisma.product.update({
			where: {
				barcode: barcode,
			},
			data: {
				flag: "FAVOURITE",
			},
			select: {
				barcode: true,
				name: true,
				flag: true,
			},
		});
	} else {
		return await prisma.product.update({
			where: {
				barcode: barcode,
			},
			data: {
				flag: "ACTIVED",
			},
			select: {
				barcode: true,
				name: true,
				flag: true,
			},
		});
	}
};
const deleted = async (barcode) => {
	barcode = validate(getBarcodeValidation, barcode);

	const result = await prisma.$transaction(async (tx) => {
		const product = await tx.product.findFirst({
			where: {
				barcode: barcode,
				flag: "DISABLED",
			},
			select: {
				barcode: true,
				name: true,
			},
		});

		if (!product)
			throw new ResponseError(404, `Product with this barcode is Not Found!`);

		const images = await tx.image.deleteMany({
			where: {
				barcode: product.barcode,
			},
		});

		const categories = await tx.categoryProduct.deleteMany({
			where: {
				barcode: product.barcode,
			},
		});

		const services = await tx.serviceProduct.deleteMany({
			where: {
				barcodeProduct: product.barcode,
			},
		});

		const component = await tx.productComponent.deleteMany({
			where: {
				barcode: product.barcode,
			},
		});

		const dataProduct = await tx.product.delete({
			where: {
				barcode: product.barcode,
			},
		});

		return { images, categories, services, component, dataProduct };
	});

	if (!result) {
		throw new ResponseError(400, "Oppsss... something wrong!");
	} else {
		return result;
	}
};
const updateProduct = async (barcode, request) => {
	request = validate(productUpdateValidation, request);

	const product = await prisma.product.findUnique({
		where: {
			barcode: barcode,
		},
		select: {
			barcode: true,
			slug: true,
		},
	});

	if (!product) throw new ResponseError(404, "Product is not found!");
	if (request.slug === product.slug) {
		return await prisma.product.update({
			where: {
				barcode: product.barcode,
			},
			data: {
				name: request.name,
				description: request.description,
			},
			select: {
				barcode: true,
				name: true,
			},
		});
	} else {
		return await prisma.product.update({
			where: {
				barcode: product.barcode,
			},
			data: {
				name: request.name,
				slug: request.slug,
				description: request.description,
			},
			select: {
				barcode: true,
				name: true,
			},
		});
	}
};
const updateCategoryProduct = async (params, request) => {
	const barcode = params.barcode;
	const categoryId = parseInt(params.categoryId);

	if (!barcode && !categoryId) throw new ResponseError(400, "Bad Request");

	request = validate(getCategoryProductValidation, request);
	let productCategory = await prisma.categoryProduct.findFirst({
		where: {
			barcode: barcode,
			categoryId: categoryId,
		},
		select: {
			barcode: true,
			categoryId: true,
		},
	});

	if (!productCategory)
		throw new ResponseError(404, "Category is not found in this products");

	if (
		productCategory.barcode === barcode &&
		productCategory.categoryId === request.categoryId
	) {
		throw new ResponseError(400, "Nothing changes");
	}
	productCategory = await prisma.categoryProduct.findFirst({
		where: {
			barcode: barcode,
			categoryId: request.categoryId,
		},
		select: {
			barcode: true,
			categoryId: true,
		},
	});
	if (productCategory) {
		throw new ResponseError(400, "Category is already exist in this products");
	} else {
		const result = await prisma.categoryProduct.update({
			where: {
				barcode_categoryId: {
					barcode: barcode,
					categoryId: categoryId,
				},
			},
			data: {
				barcode: barcode,
				categoryId: request.categoryId,
			},
			select: {
				categories: {
					select: {
						name: true,
					},
				},
			},
		});

		if (!result) {
			throw new ResponseError(404, "Oppss something wrong!");
		} else {
			return result;
		}
	}
};
const createCategoryProduct = async (request) => {
	request = validate(getCategoryProductValidation, request);

	const product = await prisma.categoryProduct.findFirst({
		where: {
			barcode: request.barcode,
			categoryId: request.categoryId,
		},
		select: {
			categories: {
				select: {
					name: true,
				},
			},
		},
	});

	if (product)
		throw new ResponseError(400, `${product.categories.name} is already Exist`);

	const result = await prisma.categoryProduct.create({
		data: request,
		select: {
			barcode: true,
			categories: {
				select: {
					name: true,
				},
			},
		},
	});

	if (!result) {
		throw new ResponseError(400, "Oppss... Something wrong!");
	} else {
		return result;
	}
};
const deleteCategoryProduct = async (params) => {
	const barcode = params.barcode;
	const categoryId = parseInt(params.categoryId);

	if (!barcode && !categoryId) throw new ResponseError(400, "Bad Request");

	let productCategory = await prisma.categoryProduct.findFirst({
		where: {
			barcode: barcode,
			categoryId: categoryId,
		},
		select: {
			barcode: true,
			categoryId: true,
		},
	});

	if (!productCategory)
		throw new ResponseError(404, "Category is not found in this products");

	const result = await prisma.categoryProduct.delete({
		where: {
			barcode_categoryId: {
				barcode: barcode,
				categoryId: categoryId,
			},
		},
		select: {
			categories: {
				select: {
					name: true,
				},
			},
		},
	});

	if (!result) {
		throw new ResponseError(404, "Oppss something wrong!");
	} else {
		return result;
	}
};

const updateServiceProduct = async (params, request) => {
	const barcode = params.barcode;
	const barcodeService = params.barcodeService;

	if (!barcode && !barcodeService) throw new ResponseError(400, "Bad Request");

	request = validate(getServiceProductValidation, request);
	console.log(barcode, barcodeService, request);
	let productService = await prisma.serviceProduct.findFirst({
		where: {
			barcodeProduct: barcode,
			barcodeService: barcodeService,
		},
		select: {
			barcodeProduct: true,
			barcodeService: true,
		},
	});

	if (!productService)
		throw new ResponseError(404, "Service is not found in this products");

	if (
		productService.barcodeProduct === barcode &&
		productService.barcodeService === request.barcodeService
	) {
		throw new ResponseError(400, "Nothing changes");
	}
	productService = await prisma.serviceProduct.findFirst({
		where: {
			barcodeProduct: barcode,
			barcodeService: request.barcodeService,
		},
		select: {
			barcodeProduct: true,
			barcodeService: true,
		},
	});
	if (productService) {
		throw new ResponseError(400, "Service is already exist in this products");
	} else {
		const result = await prisma.serviceProduct.update({
			where: {
				barcodeProduct_barcodeService: {
					barcodeProduct: barcode,
					barcodeService: barcodeService,
				},
			},
			data: {
				barcodeProduct: barcode,
				barcodeService: request.barcodeService,
			},
			select: {
				services: {
					select: {
						name: true,
					},
				},
			},
		});

		if (!result) {
			throw new ResponseError(404, "Oppss something wrong!");
		} else {
			return result;
		}
	}
};

const createServiceProduct = async (request) => {
	request = validate(getServiceProductValidation, request);

	const product = await prisma.serviceProduct.findFirst({
		where: {
			barcodeProduct: request.barcodeProduct,
			barcodeService: request.barcodeService,
		},
		select: {
			services: {
				select: {
					name: true,
				},
			},
		},
	});

	if (product)
		throw new ResponseError(400, `${product.services.name} is already Exist`);

	const result = await prisma.serviceProduct.create({
		data: request,
		select: {
			barcodeProduct: true,
			services: {
				select: {
					name: true,
				},
			},
		},
	});

	if (!result) {
		throw new ResponseError(400, "Oppss... Something wrong!");
	} else {
		return result;
	}
};

const deleteServiceProduct = async (params) => {
	const barcode = params.barcode;
	const barcodeService = params.barcodeService;

	if (!barcode && !barcodeService) throw new ResponseError(400, "Bad Request");

	let productCategory = await prisma.serviceProduct.findFirst({
		where: {
			barcodeProduct: barcode,
			barcodeService: barcodeService,
		},
		select: {
			barcodeProduct: true,
			barcodeService: true,
		},
	});

	if (!productCategory)
		throw new ResponseError(404, "Category is not found in this products");

	const result = await prisma.serviceProduct.delete({
		where: {
			barcodeProduct_barcodeService: {
				barcodeProduct: barcode,
				barcodeService: barcodeService,
			},
		},
		select: {
			services: {
				select: {
					name: true,
				},
			},
		},
	});

	if (!result) {
		throw new ResponseError(404, "Oppss something wrong!");
	} else {
		return result;
	}
};

const updateCoverProduct = async (barcode, request) => {
	request = validate(coverProductValidation, request);

	const product = await prisma.product.findFirst({
		where: {
			barcode: barcode,
		},
		select: {
			barcode: true,
			cover: true,
		},
	});
	if (!product) throw new ResponseError(404, "Product is not found!");

	return await prisma.product.update({
		where: {
			barcode: product.barcode,
			cover: product.cover,
		},
		data: {
			cover: request.cover,
		},
		select: {
			name: true,
		},
	});
};
const updateImagesProduct = async (barcode, id, request) => {
	request = validate(imagesProductValidation, request);

	const images = await prisma.image.findFirst({
		where: {
			id: id,
			barcode: barcode,
		},
		select: {
			id: true,
			barcode: true,
		},
	});
	if (!images) throw new ResponseError(404, "Image is not found!");

	return await prisma.image.update({
		where: {
			id: images.id,
			barcode: images.barcode,
		},
		data: {
			name: request.name,
			source: request.source,
		},
		select: {
			product: {
				select: {
					name: true,
				},
			},
		},
	});
};
const deleteImagesProduct = async (barcode, id) => {
	const images = await prisma.image.findFirst({
		where: {
			id: id,
			barcode: barcode,
		},
		select: {
			id: true,
			barcode: true,
		},
	});
	if (!images) throw new ResponseError(404, "Image is not found!");

	return await prisma.image.delete({
		where: {
			id: images.id,
			barcode: images.barcode,
		},
		select: {
			product: {
				select: {
					name: true,
				},
			},
		},
	});
};

const createImagesProduct = async (barcode, request) => {
	request = validate(imagesProductValidation, request);
	return await prisma.image.create({
		data: {
			barcode: barcode,
			name: request.name,
			source: request.source,
		},
		select: {
			name: true,
		},
	});
};

export default {
	create,
	findByBarcode,
	list,
	listDisabled,
	listComponents,
	listCategories,
	listService,

	changeFlag,
	favourite,
	deleted,
	updateProduct,
	updateCategoryProduct,
	createCategoryProduct,
	deleteCategoryProduct,
	updateServiceProduct,
	createServiceProduct,
	deleteServiceProduct,
	updateCoverProduct,
	updateImagesProduct,
	deleteImagesProduct,
	createImagesProduct,
};
