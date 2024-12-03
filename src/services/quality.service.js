import { prisma } from "../app/database.js";
import { ResponseError } from "../errors/Response.error.js";
import { getComponentValidation } from "../validations/component.validation.js";
import {
	getQualityValidation,
	getSizeValidation,
	qualitySizeValidation,
	qualityValidation,
	sizeValidation,
} from "../validations/qulity.validation.js";
import { validate } from "../validations/validation.js";

const create = async (request, componentId) => {
	const qualities = validate(qualitySizeValidation, request);
	componentId = validate(getComponentValidation, componentId);

	const countQualities = await prisma.quality.count({
		where: {
			componentId: componentId,
			name: qualities.name,
		},
	});

	if (countQualities >= 1)
		throw new ResponseError(
			400,
			`Quality with this ${request.name} is already exists.`
		);

	const result = await prisma.$transaction(async (tx) => {
		return await tx.quality.create({
			data: {
				componentId: componentId,
				name: request.name,
				orientation: request.orientation,
				description: request.description,
				sizes: {
					createMany: {
						data: (request.sizes || []).map((size) => ({
							qualityId: qualities.id,
							...size,
						})),
						skipDuplicates: true,
					},
				},
			},
			select: {
				id: true,
				componentId: true,
				orientation: true,
				component: {
					select: {
						id: true,
						name: true,
						canIncrise: true,
					},
				},
				sizes: {
					select: {
						qualityId: true,
						name: true,
						id: true,
						width: true,
						height: true,
						weight: true,
						price: true,
						cogs: true,
						length: true,
					},
				},
			},
		});
	});

	if (!result) throw new ResponseError(400, "Opsss... something wrong!");
	return result;
};

const updateQuality = async (reqParams, requestBody) => {
	const componentId = validate(getComponentValidation, reqParams.componentId);
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

const deletedQuality = async (reqParams) => {
	const componentId = validate(getComponentValidation, reqParams.componentId);
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

	return await prisma.$transaction([
		prisma.size.deleteMany({
			where: {
				qualityId: componentQuality.id,
			},
		}),
		prisma.quality.delete({
			where: {
				id: componentQuality.id,
				componentId: componentQuality.componentId,
				flag: componentQuality.flag,
			},
			select: {
				id: true,
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
