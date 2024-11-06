import {
	getServiceValidation,
	serviceValidation,
} from "../validations/service.validation.js";
import { validate } from "../validations/validation.js";
import { prisma } from "../app/database.js";
import { ResponseError } from "../errors/Response.error.js";
import slug from "slug";

const create = async (request) => {
	request = validate(serviceValidation, request);

	const countService = await prisma.service.count({
		where: {
			slug: slug(request.name),
		},
	});

	if (countService) throw new ResponseError(400, `${request.name} is exist`);

	const result = await prisma.$transaction(async (tx) => {
		const service = await prisma.service.create({
			data: {
				name: request.name,
				slug: slug(request.name),
			},
			select: {
				barcode: true,
				name: true,
			},
		});

		const categoryService = await prisma.categoryService.createMany({
			data: (request.categoryService || []).map((category) => ({
				barcode: service.barcode,
				categoryId: category.categoryId,
			})),
			skipDuplicates: true,
		});

		return { service, categoryService };
	});

	if (!result) throw new ResponseError(400, "Opss... something wrong!");
	return result;
};

const detail = async (barcode) => {
	barcode = validate(getServiceValidation, barcode);

	const result = await prisma.service.findUnique({
		where: {
			barcode: barcode,
		},
		select: {
			barcode: true,
			name: true,
			category_service: {
				select: {
					categories: {
						select: {
							id: true,
							name: true,
						},
					},
				},
			},
			service_product: {
				select: {
					products: {
						select: {
							name: true,
							description: true,
							totalPrice: true,
							totalCogs: true,
						},
					},
				},
			},
		},
	});

	if (!result) throw new ResponseError(404, "Service is not found");
	return result;
};

const update = async (barcode, request) => {
	barcode = validate(getServiceValidation, barcode);
	const service = await prisma.service.findFirst({
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
		},
	});

	if (!service) throw new ResponseError(404, "Services is not found");

	request = validate(serviceValidation, request);
	const countService = await prisma.service.count({
		where: {
			slug: slug(request.name),
		},
	});

	if (service.slug !== slug(request.name)) {
		if (countService === 1)
			throw new ResponseError(400, `${request.name} is exixts`);
	}

	const result = await prisma.$transaction(async (tx) => {
		const service = await prisma.service.update({
			data: {
				name: request.name,
			},
			where: {
				barcode: barcode,
			},
			select: {
				barcode: true,
				name: true,
			},
		});

		const categoryService = await prisma.categoryService.createMany({
			data: (request.categoryService || []).map((category) => ({
				barcode: service.barcode,
				categoryId: category.categoryId,
			})),
			skipDuplicates: true,
		});

		return { service, categoryService };
	});

	if (!result) throw new ResponseError(400, "Opss... something wrong!");
	return result;
};

const list = async () => {
	const result = await prisma.service.findMany({
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
			flag: true,
		},
		orderBy: {
			flag: "desc",
		},
	});

	if (result.length === 0) throw new ResponseError(404, "Service is empty");
	return result;
};

const listDisabled = async () => {
	const result = await prisma.service.findMany({
		where: {
			flag: "DISABLED",
		},
		select: {
			name: true,
			barcode: true,
			flag: true,
		},
	});

	if (result.length === 0) throw new ResponseError(404, "Service is empty");
	return result;
};

const deleted = async (barcode) => {
	barcode = validate(getServiceValidation, barcode);
	const service = await prisma.service.count({
		where: {
			barcode: barcode,
			flag: "DISABLED",
		},
	});

	if (service === 0)
		throw new ResponseError(
			404,
			"Service's is not found or not required to remove"
		);
	return await prisma.$transaction(async (tx) => {
		const category = await tx.categoryService.deleteMany({
			where: {
				barcode: barcode,
			},
		});

		const product = await tx.serviceProduct.deleteMany({
			where: {
				barcodeService: barcode,
			},
		});
		const service = await tx.service.delete({
			where: {
				barcode: barcode,
				flag: "DISABLED",
			},
			select: {
				barcode: true,
			},
		});

		return { service, category, product };
	});
};

const changeFlag = async (barcode) => {
	barcode = validate(getServiceValidation, barcode);
	let service = await prisma.service.findUnique({
		where: {
			barcode: barcode,
		},
		select: {
			barcode: true,
			flag: true,
		},
	});

	if (service.flag === "ACTIVED" || service.flag === "FAVOURITE") {
		service.flag = "DISABLED";
	} else {
		service.flag = "ACTIVED";
	}

	return await prisma.service.update({
		where: {
			barcode: barcode,
		},
		data: {
			flag: service.flag,
		},
	});
};

const favourite = async (barcode) => {
	barcode = validate(getServiceValidation, barcode);
	const service = await prisma.service.findUnique({
		where: {
			barcode: barcode,
		},
		select: {
			barcode: true,
			flag: true,
		},
	});

	if (!service) throw new ResponseError("404", "Service is not found");
	if (service.flag === "ACTIVED") {
		return await prisma.service.update({
			where: {
				barcode: service.barcode,
			},
			data: {
				flag: "FAVOURITE",
			},
			select: {
				name: true,
				flag: true,
			},
		});
	} else {
		return await prisma.service.update({
			where: {
				barcode: service.barcode,
			},
			data: {
				flag: "ACTIVED",
			},
			select: {
				name: true,
				flag: true,
			},
		});
	}
};

const deleteCategoriesService = async (params) => {
	if (!params.barcode && !params.categoryId) {
		throw new ResponseError(400, "Request is not valid");
	}

	const barcode = params.barcode;
	const categoryId = parseInt(params.categoryId);
	console.log(barcode, categoryId);

	const result = await prisma.categoryService.deleteMany({
		where: {
			categoryId: categoryId,
			barcode: barcode,
		},
	});
	if (!result) throw new ResponseError(400, "Opsss... something wrong!");
	return result;
};

export default {
	create,
	detail,
	update,
	list,
	listDisabled,
	deleted,
	favourite,
	changeFlag,
	deleteCategoriesService,
};
