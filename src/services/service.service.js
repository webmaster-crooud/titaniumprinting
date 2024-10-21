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

	let slugable = request.slug;
	if (slugable === undefined) {
		slugable = slug(request.name);
	}
	const countService = await prisma.service.count({
		where: {
			slug: slugable,
		},
	});

	if (countService) throw new ResponseError(400, `${request.name} is exist`);

	request.slug = slugable;
	console.log(request);
	return await prisma.service.create({
		data: request,
		select: {
			name: true,
		},
	});
};

const detail = async (barcode) => {
	barcode = validate(getServiceValidation, barcode);

	const result = await prisma.service.findUnique({
		where: {
			barcode: barcode,
			flag: "ACTIVED",
		},
		select: {
			barcode: true,
			name: true,
			category_service: {
				select: {
					categories: {
						select: {
							name,
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
		},
	});

	if (!service) throw new ResponseError(404, "Services is not found");

	request = validate(serviceValidation, request);
	const countService = await prisma.service.count({
		where: {
			slug: slug(request.name),
		},
	});

	if (countService === 1)
		throw new ResponseError(400, `${request.name} is exixts`);

	const result = await prisma.service.update({
		where: {
			barcode: service.barcode,
		},
		data: {
			name: request.name,
		},
		select: {
			name: true,
		},
	});

	if (!result)
		throw new ResponseError(400, "Opss... something happen on updating data");

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
	return await prisma.service.delete({
		where: {
			barcode: barcode,
			flag: "DISABLED",
		},
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
		},
	});

	if (!service) throw new ResponseError("404", "Service is not found");
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
};
