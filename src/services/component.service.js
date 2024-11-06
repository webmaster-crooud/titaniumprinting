import { Prisma } from "@prisma/client";
import { prisma } from "../app/database.js";
import {
	componentValidation,
	getComponentValidation,
} from "../validations/component.validation.js";
import { validate } from "../validations/validation.js";
import { ResponseError } from "../errors/Response.error.js";

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

const list = async () => {
	const countComponent = await prisma.component.count({
		where: {
			flag: "ACTIVED",
		},
	});

	if (countComponent === 0) throw new ResponseError(404, "Components is empty");
	return await prisma.component.findMany({
		where: {
			flag: "ACTIVED",
		},
		select: {
			id: true,
			name: true,
			flag: true,
			typeComponent: true,
			createdAt: true,
			updatedAt: true,
		},
		orderBy: {
			createdAt: "desc",
		},
	});
};

const listDisabled = async () => {
	const countComponent = await prisma.component.count({
		where: {
			flag: "DISABLED",
		},
	});

	if (countComponent === 0)
		throw new ResponseError(404, "Components Disabled is empty");
	return await prisma.component.findMany({
		where: {
			flag: "DISABLED",
		},
		select: {
			id: true,
			name: true,
			flag: true,
			typeComponent: true,
			createdAt: true,
			updatedAt: true,
		},
		orderBy: {
			createdAt: "desc",
		},
	});
};

const findById = async (componentId) => {
	componentId = validate(getComponentValidation, componentId);
	const component = await prisma.component.findUnique({
		where: {
			id: componentId,
			flag: "ACTIVED",
		},
		select: {
			id: true,
			name: true,
			flag: true,
			price: true,
			cogs: true,
			typeComponent: true,
			createdAt: true,
			updatedAt: true,
			canIncrise: true,
			qualities: {
				select: {
					id: true,
					name: true,
					flag: true,
					orientation: true,
					sizes: {
						select: {
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
			},
		},
	});

	if (!component) throw new ResponseError(404, "Components is not found");
	return component;
};

const update = async (componentId, request) => {
	componentId = validate(getComponentValidation, componentId);
	const component = await prisma.component.findUnique({
		where: { id: componentId, flag: "ACTIVED" },
		select: {
			id: true,
		},
	});

	if (!component) throw new ResponseError(404, "Component is not found");

	const requestBody = validate(componentValidation, request);
	const result = await prisma.component.update({
		where: {
			id: componentId,
		},
		data: requestBody,
		select: {
			id: true,
			name: true,
		},
	});

	return result;
};

const disabled = async (componentId) => {
	componentId = validate(getComponentValidation, componentId);
	const component = await prisma.component.findUnique({
		where: {
			id: componentId,
		},
		select: {
			id: true,
			flag: true,
		},
	});

	if (!component) throw new ResponseError(404, "Components is not exits");

	if (component.flag === "ACTIVED") {
		return await prisma.component.update({
			where: { id: componentId },
			data: {
				flag: "DISABLED",
			},
			select: {
				name: true,
				flag: true,
			},
		});
	} else {
		return await prisma.component.update({
			where: { id: componentId },
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

const deleted = async (componentId) => {
	componentId = validate(getComponentValidation, componentId);
	const component = await prisma.component.findUnique({
		where: {
			id: componentId,
			flag: "DISABLED",
		},
		select: {
			id: true,
		},
	});
	if (!component)
		throw new ResponseError(400, "Components is not require to deleted");

	return await prisma.$transaction(async (tx) => {
		const quality = await tx.quality.findMany({
			where: {
				componentId: componentId,
			},
		});

		// Deleted sizes with quality ID
		await Promise.all(
			quality.map(async (data) => {
				const sizes = await tx.size.deleteMany({
					where: { qualityId: data.id },
				});
				return sizes;
			})
		);

		// Deleted Quality with Compoenet id
		await tx.quality.deleteMany({
			where: {
				componentId: component.id,
			},
		});

		// Deleted Component
		await tx.component.delete({
			where: {
				id: component.id,
			},
			select: {
				id: true,
			},
		});
	});
};

export default {
	create,
	list,
	findById,
	update,
	disabled,
	deleted,
	listDisabled,
};
