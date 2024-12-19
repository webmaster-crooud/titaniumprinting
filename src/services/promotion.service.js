import { promotionValidation } from "../validations/promotion.validation.js";
import { validate } from "../validations/validation.js";
import { prisma } from "../app/database.js";
import { ResponseError } from "../errors/Response.error.js";

const create = async (request) => {
	request = validate(promotionValidation, request);

	console.log(request);
	const countCode = await prisma.promotion.count({
		where: {
			code: request.code,
		},
	});

	if (countCode >= 1)
		throw new ResponseError(400, "Code promotion is already!");

	const valueDic = request.price || request.percent;
	if (!valueDic)
		throw new ResponseError(400, "Price or Percent is not defined");

	return await prisma.promotion.create({
		data: request,
		select: {
			code: true,
		},
	});
};

const list = async () => {
	return await prisma.promotion.findMany({
		select: {
			code: true,
			start: true,
			end: true,
			percent: true,
			price: true,
		},
		orderBy: {
			start: "asc",
		},
	});
};

const update = async (code, request) => {
	request = validate(request, promotionValidation);
	if (code !== request.code) {
		const count = await prisma.promotion.count({
			where: {
				code: request.code,
			},
		});

		if (count >= 1) {
			throw new ResponseError(400, "Code promotion is already!");
		}
	}

	const result = await prisma.promotion.update({
		where: {
			code: code,
		},
		data: request,
		select: {
			code: true,
		},
	});

	if (result) {
		throw new ResponseError(404, "Promotion is not found!");
	} else {
		return result;
	}
};

const deleted = async (code) => {
	const result = await prisma.promotion.delete({
		where: {
			code: code,
		},
	});

	if (!result) {
		throw new ResponseError(404, "Promotion is not found!");
	} else {
		return result;
	}
};

export default { create, list, update, deleted };
