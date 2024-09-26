import { prisma } from "../../src/app/database.js";
export const createTestCategory = async () => {
	await prisma.category.create({
		data: {
			name: "Category Test Name",
		},
	});
};
export const removeTestCategory = async () => {
	await prisma.category.deleteMany({
		where: {
			slug: "category-test-name",
		},
	});
};

export const cleanCategoryTable = async () => {
	await prisma.category.deleteMany();
};

export const dummyCategoriesList = async () => {
	const categories = [];
	for (let index = 0; index <= 25; index++) {
		categories.push({
			name: `Category Test Name ${index + 1}`,
			slug: `category-test-name-${index + 1}`,
		});
	}
	await prisma.category.createMany({
		data: categories,
	});
};
