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

const checkExistingQuality = async (componentId, name) => {
	const existingQuality = await prisma.quality.findFirst({
		where: { componentId, name },
	});
	if (existingQuality) {
		throw new ResponseError(400, `Quality with name "${name}" for this component already exists.`);
	}
};

const createQuality = async (qualityData) => {
	return Promise.all(qualityData.map((data) => prisma.quality.create({ data })));
};

const createSizes = async (requestBody, createdQualities) => {
	const sizesData = requestBody.flatMap(({ sizes }, index) =>
		sizes.map((size) => ({
			qualityId: createdQualities[index].id,
			width: size.width,
			height: size.height,
			weight: size.weight,
			price: size.price,
			cogs: size.cogs,
		}))
	);
	await prisma.size.createMany({ data: sizesData });
};

const create = async (componentId, request) => {
	const requestBody = validate(qualitySizeValidation, request);
	const qualityData = requestBody.map(({ name, image, orientation }) => ({
		componentId,
		name,
		image,
		orientation,
	}));

	for (const { name } of requestBody) {
		await checkExistingQuality(componentId, name);
	}

	const result = await prisma.$transaction(async (prisma) => {
		const createdQualities = await createQuality(qualityData);
		await createSizes(requestBody, createdQualities);
		return createdQualities;
	});

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

	console.log("Size:", sizeId);
	console.log("Quality:", qualityId);
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
	if (!size) throw new ResponseError(404, `Size is not found in ${size.quality.name}`);

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

	if (!size) throw new ResponseError(404, `Size is not found in ${size.quality.name}`);

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
export default { create, updateQuality, deletedQuality, updateSize, deleteSize };
