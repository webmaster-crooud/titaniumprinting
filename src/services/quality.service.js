import { prisma } from "../app/database.js";
import { ResponseError } from "../errors/Response.error.js";
import { qualitySizeValidation } from "../validations/qulity.validation.js";
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

export default { create };
