import { createCategoryValidation } from "../validations/category.valdation.js";
import { validate } from "../validations/validation.js";
import { prisma } from "../app/database.js";
import { ResponseError } from "../errors/Response.error.js";
import slug from "slug";

const create = async (request) => {
	const category = validate(createCategoryValidation, request);

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

	if (countCategory > 0) throw new ResponseError(400, "Category is existed");

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

export default { create };
