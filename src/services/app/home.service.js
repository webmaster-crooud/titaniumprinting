import { prisma } from "../../app/database.js";
const homePage = async () => {
	return await prisma.$transaction(async (tx) => {
		const categories = await tx.category.findMany({
			where: {
				OR: [{ flag: "ACTIVED" }, { flag: "FAVOURITE" }],
			},
			select: {
				name: true,
				flag: true,
				description: true,
				slug: true,
				category_product: {
					select: {
						products: {
							select: {
								name: true,
								slug: true,
								flag: true,
								cover: true,
							},
						},
					},
					where: {
						OR: [
							{
								products: {
									flag: "ACTIVED",
								},
							},
							{
								products: {
									flag: "FAVOURITE",
								},
							},
						],
					},
					orderBy: {
						products: {
							flag: "desc",
						},
					},
				},
			},
			orderBy: {
				flag: "desc",
			},
		});

		const favCategories = await tx.category.findMany({
			where: {
				flag: "FAVOURITE",
			},
			select: {
				name: true,
				flag: true,
				description: true,
				slug: true,
			},
			take: 4,
			orderBy: {
				id: "asc",
			},
		});

		let services = await tx.service.findMany({
			where: {
				OR: [
					{
						flag: "FAVOURITE",
					},
					{
						flag: "ACTIVED",
					},
				],
			},
			select: {
				name: true,
				flag: true,
				slug: true,
				service_product: {
					take: 1,
					include: {
						products: {
							select: {
								cover: true,
								description: true,
								name: true,
								slug: true,
							},
						},
					},
				},
			},
			take: 2,
			orderBy: {
				flag: "desc",
			},
		});

		return { categories, favCategories, services };
	});
};

export default { homePage };
