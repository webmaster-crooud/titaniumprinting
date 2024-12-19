import { validate } from "../validations/validation.js";
import { addPricing } from "../validations/pricing.validation.js";
import { prisma } from "../app/database.js";
import { ResponseError } from "../errors/Response.error.js";

const create = async (request) => {
	request = validate(addPricing, request);

	for (const data of request) {
		let entityExists;
		switch (data.entityType) {
			case "qualitySize":
				entityExists = await prisma.qualitySize.findUnique({
					where: { id: data.entityId },
				});
				break;
			case "component":
				entityExists = await prisma.component.findUnique({
					where: { id: data.entityId },
				});
				break;
			case "quality":
				entityExists = await prisma.quality.findUnique({
					where: { id: data.entityId },
				});
				break;
			default:
				throw new ResponseError(400, `Invalid entityType: ${data.entityType}`);
		}

		if (!entityExists) {
			throw new ResponseError(
				404,
				`${data.entityType} with id ${data.entityId} does not exist.`
			);
		}

		await prisma.progressivePricing.create({
			data: {
				entityType: data.entityType,
				entityId: data.entityId,
				minQty: data.minQty,
				maxQty: data.maxQty,
				price: data.price,
			},
		});
	}
};

const deleted = async (id) => {
	const find = prisma.progressivePricing.findUnique({
		where: {
			id: id,
		},
	});
	if (!find) throw new ResponseError(404, "Progressive Pricing is not found!");
	await prisma.progressivePricing.delete({
		where: {
			id: id,
		},
	});
};

const list = async (entityId, entityType) => {
	return await prisma.progressivePricing.findMany({
		where: {
			entityId: entityId,
			entityType: entityType,
		},
		select: {
			id: true,
			entityId: true,
			entityType: true,
			minQty: true,
			maxQty: true,
			price: true,
		},
		orderBy: {
			minQty: "asc",
		},
	});
};

export default { create, list, deleted };
