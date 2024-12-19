import { prisma } from "../app/database.js";
import { ResponseError } from "../errors/Response.error.js";
import {
	addToQualityValidation,
	createSizeValidation,
	getSizeValidation,
	sizeValidation,
} from "../validations/size.validation.js";
import { validate } from "../validations/validation.js";

const create = async (sizes) => {
	sizes = validate(createSizeValidation, sizes);

	sizes.map(async (size) => {
		const countSize = await prisma.size.count({
			where: {
				name: size.name,
			},
		});

		if (countSize !== 0)
			throw new ResponseError(400, `Size ${size.name} is already exists`);
	});

	const data = sizes.map((size) => ({
		name: size.name,
		width: size.width,
		length: size.length,
		height: size.height,
		weight: size.weight,
		wide: size.width * size.length,
	}));
	return await prisma.size.createMany({
		data: data,
		skipDuplicates: true,
	});
};

const list = async () => {
	return await prisma.size.findMany({
		select: {
			id: true,
			name: true,
		},
	});
};

const detail = async (sizeId) => {
	sizeId = validate(getSizeValidation, sizeId);

	const result = await prisma.size.findUnique({
		where: {
			id: sizeId,
		},
		select: {
			name: true,
			height: true,
			length: true,
			weight: true,
			width: true,
		},
	});

	if (!result) {
		throw new ResponseError(404, "Size is not found.");
	} else {
		return result;
	}
};

const update = async (sizeId, request) => {
	sizeId = validate(getSizeValidation, sizeId);
	const findSize = await prisma.size.findUnique({
		where: {
			id: sizeId,
		},
		select: {
			id: true,
			name: true,
		},
	});

	const data = validate(sizeValidation, request);

	if (!findSize) {
		throw new ResponseError(404, "Size is not found!");
	}

	return await prisma.size.update({
		where: {
			id: findSize.id,
		},
		data: {
			wide: data.width * data.length,
			width: data.width,
			height: data.height,
			weight: data.weight,
			length: data.length,
			name: data.name,
		},
		select: {
			id: true,
			name: true,
		},
	});
};

const deleted = async (sizeId, request) => {
	sizeId = validate(getSizeValidation, sizeId);
	const findSize = await prisma.size.findUnique({
		where: {
			id: sizeId,
		},
		select: {
			id: true,
			name: true,
		},
	});

	const data = validate(sizeValidation, request);

	if (!findSize) {
		throw new ResponseError(404, "Size is not found!");
	}

	return await prisma.size.update({
		where: {
			id: findSize.id,
		},
		data: {
			wide: data.width * data.length,
			width: data.width,
			height: data.height,
			weight: data.weight,
			length: data.length,
			name: data.name,
		},
		select: {
			id: true,
			name: true,
		},
	});
};

const addToQuality = async (request) => {
	request = validate(addToQualityValidation, request);

	const createQualitySize = request.map((req) => ({
		qualityId: req.qualityId,
		sizeId: req.sizeId,
		price: req.price,
		cogs: req.cogs,
	}));
	await prisma.qualitySize.createMany({
		data: createQualitySize,
		skipDuplicates: true,
	});
};

const deletedOnQuality = async (id) => {
	const find = await prisma.qualitySize.findFirst({
		where: {
			id: id,
		},
		select: {
			id: true,
			qualityId: true,
			sizeId: true,
		},
	});

	if (!find) throw new ResponseError(404, "Data is not found!");

	await prisma.progressivePricing.deleteMany({
		where: {
			OR: [
				{
					entityId: find.qualityId,
					entityType: "quality",
				},
				{
					entityId: find.id,
					entityType: "qualitySize",
				},
			],
		},
	});

	await prisma.qualitySize.deleteMany({
		where: {
			qualityId: find.qualityId,
			sizeId: find.sizeId,
		},
	});
};

export default { create, list, update, detail, addToQuality, deletedOnQuality };
