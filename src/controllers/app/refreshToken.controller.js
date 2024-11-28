import { prisma } from "../../app/database.js";
import jwt from "jsonwebtoken";
import { ResponseError } from "../../errors/Response.error.js";
import dotenv from "dotenv";
dotenv.config();

export const refreshToken = async (req, res, next) => {
	try {
		const refreshToken = req.cookies.refreshToken;
		console.log(refreshToken);
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
				userId: account.users.id,
				email: account.email,
				username: account.users.account.username,
			};

			const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_TOKEN, {
				expiresIn: "1m",
			});

			res.status(200).json({ data: accessToken });
		});
	} catch (error) {
		next(error);
	}
};
