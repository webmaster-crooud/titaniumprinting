import { prisma } from "../app/database.js";
import { ResponseError } from "../errors/Response.error.js";
import {
	getQualityValidation,
	getSizeValidation,
	qualitySizeValidation,
	qualityValidation,
	sizeValidation,
} from "../validations/qulity.validation.js";
import { validate } from "../validations/validation.js";

const create = async (request, componentId) => {
	if (!request.price) {
		console.log("SIZE");
		validate(qualitySizeValidation, request);
	} else {
		console.log("PRICE");
		validate(qualityValidation, request);
	}

	const countQualities = await prisma.quality.count({
		where: {
			componentId: componentId,
			name: request.name,
			flag: "ACTIVED",
		},
	});

	if (countQualities >= 1)
		throw new ResponseError(400, `Quality ${request.name} is already exists.`);

	const result = await prisma.$transaction(async (tx) => {
		const createQuality = await tx.quality.create({
			data: {
				componentId: componentId,
				name: request.name,
				price: request.price,
				cogs: request.cogs,
			},
		});

		const dataQualitiesSize = request.qualitiesSize.map((data) => ({
			qualityId: createQuality.id,
			sizeId: data.sizeId,
			price: data.price,
			cogs: data.cogs,
		}));
		await tx.qualitySize.createMany({
			data: dataQualitiesSize,
			skipDuplicates: true,
		});

		return createQuality;
	});

	if (!result) throw new ResponseError(400, "Opsss... something wrong!");
	return result;
};

const updateQuality = async (reqParams, requestBody) => {
	// const componentId = validate(getComponentValidation, reqParams.componentId);
	const qualityId = validate(getQualityValidation, reqParams.qualityId);

	const componentQuality = await prisma.quality.findUnique({
		where: {
			id: qualityId,
			componentId: componentId,
			flag: "ACTIVED",
		},
		select: {
			id: true,
			componentId: true,
			flag: true,
		},
	});

	if (!componentQuality) throw new ResponseError(404, "Qualitiy is not found");
	requestBody = validate(qualityValidation, requestBody);
	return await prisma.quality.update({
		where: {
			id: componentQuality.id,
			componentId: componentQuality.componentId,
			flag: componentQuality.flag,
		},
		data: requestBody,
		select: {
			name: true,
		},
	});
};

const deletedQuality = async (componentId, qualityId) => {
	const componentQuality = await prisma.quality.findUnique({
		where: {
			id: qualityId,
			componentId: componentId,
			flag: "ACTIVED",
		},
	});

	if (!componentQuality) throw new ResponseError(404, "Qualitiy is not found");

	return await prisma.$transaction([
		prisma.quality.update({
			where: {
				id: componentQuality.id,
				componentId: componentQuality.componentId,
				flag: "ACTIVED",
			},
			data: {
				flag: "DISABLED",
			},
		}),
	]);
};

const updateSize = async (reqParams, requestBody) => {
	const sizeId = validate(getSizeValidation, reqParams.sizeId);
	const qualityId = validate(getQualityValidation, reqParams.qualityId);

	// console.log("Size:", sizeId);
	// console.log("Quality:", qualityId);
	const quality = await prisma.quality.findUnique({
		where: {
			id: qualityId,
		},
		select: {
			id: true,
		},
	});
	if (!quality) throw new ResponseError(404, "Quality id is Not Found");

	const size = await prisma.size.findFirst({
		where: {
			id: sizeId,
			qualityId: quality.id,
		},
		select: {
			id: true,
			qualityId: true,
		},
	});
	if (!size)
		throw new ResponseError(404, `Size is not found in ${size.quality.name}`);

	requestBody = validate(sizeValidation, requestBody);
	return await prisma.size.update({
		where: {
			id: size.id,
			qualityId: size.qualityId,
		},
		data: requestBody,
		select: {
			id: true,
		},
	});
};

const deleteSize = async (reqParams) => {
	const sizeId = validate(getSizeValidation, reqParams.sizeId);
	const qualityId = validate(getQualityValidation, reqParams.qualityId);

	const size = await prisma.size.findFirst({
		where: {
			id: sizeId,
			qualityId: qualityId,
		},
		select: {
			id: true,
			quality: {
				select: {
					id: true,
					name: true,
				},
			},
		},
	});

	if (!size)
		throw new ResponseError(404, `Size is not found in ${size.quality.name}`);

	return await prisma.size.delete({
		where: {
			id: size.id,
			qualityId: size.quality.id,
		},
		select: {
			id: true,
		},
	});
};
export default {
	create,
	updateQuality,
	deletedQuality,
	updateSize,
	deleteSize,
};
