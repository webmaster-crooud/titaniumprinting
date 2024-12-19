import { prisma } from "../app/database.js";
import {
	componentValidation,
	detailComponentValidation,
} from "../validations/component.validation.js";
import { validate } from "../validations/validation.js";
import { ResponseError } from "../errors/Response.error.js";
import e from "express";

const create = async (request) => {
	request = validate(componentValidation, request);
	const countComponent = await prisma.component.count({
		where: {
			name: request.name,
			flag: "ACTIVED",
		},
	});
	if (countComponent !== 0)
		throw new ResponseError(400, "Component is already exist.");

	const result = await prisma.$transaction(async (tx) => {
		if (!request.qualities) {
			const createComponent = await tx.component.create({
				data: {
					name: request.name,
					typeComponent: request.typeComponent,
					price: request.price,
					cogs: request.cogs,
				},
			});

			return createComponent;
		} else {
			const createComponent = await tx.component.create({
				data: {
					name: request.name,
					typeComponent: request.typeComponent,
				},
				select: {
					id: true,
				},
			});

			const createQuality = request.qualities.map((quality) => ({
				componentId: createComponent.id,
				name: quality.name,
				price: quality.price,
				cogs: quality.cogs,
			}));
			await tx.quality.createMany({
				data: createQuality,
				skipDuplicates: true,
			});

			return createComponent;
		}
	});

	if (!result) {
		throw new ResponseError(400, "Oppsss... something wrong!");
	} else {
		return result;
	}
};

const findById = async (componentId) => {
	componentId = validate(detailComponentValidation, parseInt(componentId));
	parseInt(componentId);

	const component = await prisma.component.findUnique({
		where: {
			id: componentId,
			flag: "ACTIVED",
		},
		select: {
			name: true,
			typeComponent: true,
			flag: true,
			price: true,
			cogs: true,
			qualities: {
				where: {
					flag: "ACTIVED",
				},
				select: {
					id: true,
					name: true,
					flag: true,
					cogs: true,
					price: true,
					qualitiesSize: {
						select: {
							id: true,
							sizes: {
								select: {
									name: true,
								},
							},
							price: true,
							cogs: true,
						},
						orderBy: {
							price: "asc",
						},
					},
				},
			},
			createdAt: true,
			updatedAt: true,
		},
	});

	if (!component) {
		throw new ResponseError(400, "Oppss... something wrong!");
	} else {
		return component;
	}
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
	const component = await prisma.component.findFirst({
		where: {
			id: componentId,
			flag: "ACTIVED",
		},
		select: {
			id: true,
		},
	});
	if (!component) throw new ResponseError(404, "Components is not found!");

	return await prisma.component.update({
		where: {
			id: componentId,
			flag: "ACTIVED",
		},
		data: {
			flag: "DISABLED",
		},
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
