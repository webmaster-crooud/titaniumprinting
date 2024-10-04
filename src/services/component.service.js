import { Prisma } from "@prisma/client";
import { prisma } from "../app/database.js";
import { componentValidation } from "../validations/component.validation.js";
import { validate } from "../validations/validation.js";

const create = async (request) => {
	const requestBody = validate(componentValidation, request);
	return await prisma.$transaction(
		async (tx) => {
			const findComponent = await tx.component.findFirst({
				where: {
					name: requestBody.name,
				},
			});
			if (findComponent) {
				return await tx.component.update({
					data: requestBody,
					where: {
						id: findComponent.id,
					},
					select: {
						id: true,
					},
				});
			} else {
				return await tx.component.create({
					data: requestBody,
					select: {
						id: true,
					},
				});
			}
		},
		{
			isolationLevel: Prisma.TransactionIsolationLevel.Serializable, // optional, default defined by database configuration
			maxWait: 5000, // default: 2000
			timeout: 10000, // default: 5000
		}
	);
};

export default { create };
