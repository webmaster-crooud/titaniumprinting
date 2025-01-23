import { prisma } from "../../app/database.js";

const list = async () => {
	return await prisma.category.findMany({
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
			},
		},
		orderBy: {
			flag: "desc",
		},
	});
};

export default { list };
