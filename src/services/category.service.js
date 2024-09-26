import { categoryValidation, getCategoryValidation } from "../validations/category.valdation.js";
import { validate } from "../validations/validation.js";
import { prisma } from "../app/database.js";
import { ResponseError } from "../errors/Response.error.js";
import slug from "slug";

const create = async (request) => {
	const category = validate(categoryValidation, request);
	if (category.slug === undefined) {
		category.slug = slug(category.name);
	} else {
		category.slug = slug(category.slug);
	}

	const countCategory = await prisma.category.count({
		where: {
			slug: category.slug,
		},
	});

	if (countCategory >= 1) throw new ResponseError(400, "Category is existed");

	return prisma.category.create({
		data: category,
		select: {
			id: true,
			name: true,
			slug: true,
			flag: true,
		},
	});
};

const findById = async (categoryId) => {
	categoryId = validate(getCategoryValidation, categoryId);

	const result = await prisma.category.findUnique({
		where: {
			id: categoryId,
		},
		select: {
			id: true,
			name: true,
			slug: true,
			description: true,
		},
	});

	if (!result) throw new ResponseError(404, "Category is not found");
	return result;
};

const update = async (categoryId, request) => {
	categoryId = validate(getCategoryValidation, categoryId);
	categoryId = await prisma.category.findUnique({
		where: {
			id: categoryId,
		},
		select: {
			id: true,
		},
	});
	if (!categoryId) throw new ResponseError(404, "Category is not found");

	const category = validate(categoryValidation, request);

	const countCategory = await prisma.category.count({
		where: { slug: category.slug },
		select: { id: true },
	});
	if (countCategory >= 1) throw new ResponseError(404, "Category is exist");

	return await prisma.category.update({
		where: {
			id: categoryId.id,
		},
		data: {
			name: category.name,
			...category,
		},
		select: {
			name: true,
			slug: true,
			description: true,
		},
	});
};

const changeFlag = async (categoryId) => {
	categoryId = validate(getCategoryValidation, categoryId);
	const category = await prisma.category.findUnique({
		where: { id: categoryId },
		select: { id: true, flag: true },
	});
	if (!category) throw new ResponseError(404, "Category is not found");
	if (category.flag == "ACTIVED") {
		category.flag = "DISABLED";
	} else {
		category.flag = "ACTIVED";
	}
	return await prisma.category.update({
		where: {
			id: categoryId,
		},
		data: {
			flag: category.flag,
		},
		select: {
			name: true,
			flag: true,
		},
	});
};

const listActive = async (page = 1, limit = 10) => {
	const result = await prisma.category.findMany({
		where: {
			OR: [
				{
					flag: "ACTIVED",
				},
				{
					flag: "FAVOURITE",
				},
			],
		},
		select: {
			id: true,
			name: true,
			slug: true,
			flag: true,
		},
		skip: (page - 1) * limit,
		take: limit,
		orderBy: {
			id: "desc",
		},
	});

	if (result <= 0) {
		throw new ResponseError(404, "Categories is empty, create new category");
	}
	return result;
};

// !TODO Favourite, Deleted and Updating ListActive

export default { create, findById, update, changeFlag, listActive };
