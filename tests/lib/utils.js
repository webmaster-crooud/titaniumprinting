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
