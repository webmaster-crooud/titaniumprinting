import { prisma } from "../../app/database.js";
import { ResponseError } from "../../errors/Response.error.js";

const getCart = async (email) => {
	const checkUser = await prisma.user.findUnique({
		where: {
			email: email,
		},
		select: {
			email: true,
		},
	});

	if (!checkUser) throw new ResponseError(400, "Users email is not found!");

	return await prisma.cart.findMany({
		where: {
			AND: [
				{
					userEmail: checkUser.email,
				},
				{
					NOT: {
						status: "ABANDONE",
					},
				},
			],
		},
		orderBy: {
			createdAt: "desc",
		},
		include: {
			product: true,
			user: true,
			cartItems: true,
		},
	});
};

const deleteCart = async (email, cartId) => {
	const checkEmail = await prisma.user.findUnique({
		where: {
			email: email,
			NOT: {
				role: "CUSTOMER",
			},
		},
	});

	if (!checkEmail)
		throw new ResponseError(
			400,
			"Email is not valid, please register new account!"
		);

	await prisma.cart.delete({
		where: {
			id: cartId,
			userEmail: email,
		},
	});
};

export default { getCart, deleteCart };
