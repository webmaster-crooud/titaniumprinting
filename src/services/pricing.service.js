import { prisma } from "../app/database.js";
import { ResponseError } from "../errors/Response.error.js";
import {
	addPricing,
	pricingValidation,
} from "../validations/pricing.validation.js";
import { validate } from "../validations/validation.js";

const addPricingQuality = async (request) => {
	request = validate(pricingValidation, request);
	return await prisma.$transaction(async (tx) => {
		const find = await tx.pricing.findFirst({
			where: {
				componentId: request.componentId,
				qualityId: request.qualityId,
				sizeId: request.sizeId,
			},
		});

		if (find) {
			return await tx.pricing.update({
				where: {
					id: find.id,
				},
				data: {
					price: request.price,
					cogs: request.cogs,
				},
			});
		} else {
			return await tx.pricing.create({
				data: {
					price: request.price,
					cogs: request.cogs,
					components: {
						connect: {
							id: request.componentId,
						},
					},
					qualities: {
						connect: {
							id: request.qualityId,
						},
					},
					sizes: {
						connect: {
							id: request.sizeId,
						},
					},
				},
			});
		}
	});
};

const addPricingSize = async (request) => {
	request = validate(addPricing, request);
	const findQuality = await prisma.pricing.findFirst({
		where: {
			componentId: request[0].componentId,
			qualityId: request[0].qualityId,
		},
	});
	if (findQuality) {
		await prisma.pricing.delete({
			where: {
				id: findQuality.id,
			},
		});
	}
	const createSizePricing = request.map((size) => ({
		componentId: size.componentId,
		qualityId: size.qualityId,
		sizeId: size.sizeId,
		price: size.price,
		cogs: size.cogs,
	}));
	return await prisma.pricing.createMany({
		data: createSizePricing,
		skipDuplicates: true,
	});
};

const getSizeFromQuality = async (qualityId) => {
	console.log(qualityId);
	const size = await prisma.size.findMany({
		where: {
			pricings: {
				some: {
					qualityId: qualityId,
				},
			},
		},
		select: {
			name: true,
			pricings: {
				select: {
					price: true,
					cogs: true,
				},
			},
		},
	});
	console.log(size);

	if (size.length === 0) {
		throw new ResponseError(404, "Size is not found");
	} else {
		return size;
	}
};

export default { addPricingQuality, addPricingSize, getSizeFromQuality };
