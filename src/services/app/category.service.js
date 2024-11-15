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
			slug: true,
			description: true,
			flag: true,
		},
		orderBy: {
			flag: "desc",
		},
	});
};

export default { list };
