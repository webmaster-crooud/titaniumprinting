import { prisma } from "../../app/database.js";
import jwt from "jsonwebtoken";
import { ResponseError } from "../../errors/Response.error.js";
import dotenv from "dotenv";
dotenv.config();
dotenv.config({ path: ".env.production" });

export const refreshToken = async (req, res, next) => {
	try {
		const refreshToken = req.cookies.refreshToken;

		if (!refreshToken) throw new ResponseError(401, "Unauthorization");
		const account = await prisma.refreshToken.findFirst({
			where: {
				token: refreshToken,
			},
			select: {
				email: true,
				token: true,
				users: {
					select: {
						id: true,
						firstName: true,
						lastName: true,
						role: true,
						account: {
							select: {
								username: true,
							},
						},
					},
				},
			},
		});

		if (!account) throw new ResponseError(403, "Forbidden");
		jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN, (err, decoded) => {
			if (err) throw new ResponseError(403, "Forbidden");
			const payload = {
				email: account.email,
				username: account.users.account.username,
				firstName: account.users.firstName,
				lastName: account.users.lastName,
				role: account.users.role,
			};

			const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_TOKEN, {
				expiresIn: "1m",
			});

			res.status(200).json({ token: accessToken });
		});
	} catch (error) {
		next(error);
	}
};
