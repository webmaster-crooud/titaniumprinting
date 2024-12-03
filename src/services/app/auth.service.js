import { prisma } from "../../app/database.js";
import { ResponseError } from "../../errors/Response.error.js";
import { formatTime, formatUnix } from "../../libs/moment.js";
import {
	emailVerifyValidation,
	loginValidation,
	registerValidation,
} from "../../validations/app/auth.validation.js";
import { validate } from "../../validations/validation.js";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const listUsers = async () => {
	return await prisma.account.findMany({
		select: {
			email: true,
			status: true,
			ipAddress: true,
			userAgent: true,
			username: true,
			googleId: true,
			user: {
				select: {
					addresses: true,
					cart: true,
					firstName: true,
					lastName: true,
					phone: true,
					role: true,
				},
			},
		},
	});
};

const register = async (request) => {
	let requestBody = request.body;
	requestBody = validate(registerValidation, requestBody);

	const countAccount = await prisma.account.count({
		where: {
			email: requestBody.email,
		},
	});

	if (countAccount !== 0)
		throw new ResponseError(400, "This email already exist!");

	const salt = bcrypt.genSalt(parseInt(process.env.ROUNDS));
	const userPassword = bcrypt.hashSync(requestBody.password, parseInt(salt));

	const now = new Date();
	const result = await prisma.user.create({
		data: {
			email: requestBody.email,
			firstName: requestBody.firstName,
			lastName: requestBody.lastName,
			account: {
				create: {
					password: userPassword,
					ipAddress: request.ip,
					userAgent: request.get("user-agent"),
				},
			},
			emailVerify: {
				create: {
					token: uuid(),
					expiredAt: new Date(now.getTime() + 5 * 60 * 1000),
				},
			},
		},
		select: {
			email: true,
			firstName: true,
			lastName: true,
			role: true,
			account: {
				select: {
					ipAddress: true,
					userAgent: true,
					status: true,
				},
			},
			emailVerify: {
				select: {
					token: true,
					expiredAt: true,
					type: true,
				},
			},
		},
	});

	if (!result) {
		throw new ResponseError(400, "Oppsss... Something wrong!");
	} else {
		return result;
	}
};

const emailVerify = async (request) => {
	request = validate(emailVerifyValidation, request);
	// Check verify
	const find = await prisma.emailVerify.findFirst({
		where: {
			email: request.email,
		},
		select: {
			email: true,
			expiredAt: true,
			token: true,
			user: {
				select: {
					account: {
						select: {
							status: true,
						},
					},
				},
			},
		},
	});

	if (!find)
		throw new ResponseError(
			404,
			"Email Verify is not found! Please register first"
		);

	const accountStatus = find.user.account.status;
	if (accountStatus !== "PENDING")
		throw new ResponseError(400, "Account is already Active!");
	if (find.token !== request.token)
		throw new ResponseError(
			400,
			"Token is not valid, please check your email!"
		);

	const now = formatUnix(new Date());
	const expired = formatUnix(find.expiredAt);
	if (now > expired)
		throw new ResponseError(
			400,
			"Token is expired, please send email verification again!"
		);

	return await prisma.account.update({
		where: {
			email: find.email,
		},
		data: {
			status: "ACTIVED",
		},
		select: {
			email: true,
			status: true,
		},
	});
};

const resendEmailVerify = async (email) => {
	const findEmailVerify = await prisma.emailVerify.findUnique({
		where: {
			email: email,
		},
		select: {
			email: true,
			token: true,
			expiredAt: true,
			user: {
				select: {
					account: {
						select: {
							status: true,
						},
					},
				},
			},
		},
	});

	if (!findEmailVerify)
		throw new ResponseError(400, "Account's with this email is not found!");
	if (findEmailVerify.user.account.status !== "PENDING")
		throw new ResponseError(
			400,
			`${email} is already ${findEmailVerify.user.account.status}`
		);

	let now = formatUnix(new Date());
	const expired = formatUnix(findEmailVerify.expiredAt);

	// console.log(formatTime(new Date()));
	// console.log(formatTime(findEmailVerify.expiredAt));
	if (now < expired)
		throw new ResponseError(
			400,
			`Token is not expired, if you want to resend email verification please wait until ${formatTime(
				findEmailVerify.expiredAt
			)}`
		);

	now = new Date();
	const result = await prisma.emailVerify.update({
		where: {
			email: findEmailVerify.email,
			token: findEmailVerify.token,
		},
		data: {
			token: uuid(),
			expiredAt: new Date(now.getTime() + 5 * 60 * 1000),
		},
		select: {
			email: true,
			expiredAt: true,
			token: true,
			user: {
				select: {
					firstName: true,
					lastName: true,
				},
			},
		},
	});

	if (!result) {
		throw new ResponseError(400, "Oppsss... Something wrong!");
	} else {
		return result;
	}
};

const login = async (request) => {
	request = validate(loginValidation, request);
	const account = await prisma.account.findFirst({
		where: {
			OR: [
				{
					email: request.email,
				},
				{
					username: request.username,
				},
			],
		},
		select: {
			email: true,
			username: true,
			password: true,
			status: true,
			googleId: true,
			user: {
				select: {
					id: true,
					firstName: true,
					lastName: true,
					role: true,
				},
			},
		},
	});

	if (!account) throw new ResponseError(404, "Account is not registered!");
	if (account.status === "PENDING")
		throw new ResponseError(
			400,
			"Account is not ready active, please confirmation activation email varify first!"
		);

	const match = bcrypt.compareSync(request.password, account.password);

	if (!match)
		throw new ResponseError(400, "Login is not valid, check your input!");

	const payload = {
		email: account.email,
		username: account.username,
		firstName: account.user.firstName,
		lastName: account.user.lastName,
		role: account.user.role,
	};
	const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_TOKEN, {
		expiresIn: "1m",
	});
	const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_TOKEN, {
		expiresIn: "1d",
	});

	const findToken = await prisma.refreshToken.findUnique({
		where: {
			email: account.email,
		},
		select: { email: true },
	});
	if (!findToken) {
		const now = new Date();
		await prisma.refreshToken.create({
			data: {
				email: account.email,
				token: refreshToken,
				expiredAt: new Date(now.getTime() + 5 * 60 * 1000),
			},
		});
	} else {
		const now = new Date();
		await prisma.refreshToken.update({
			where: {
				email: account.email,
			},
			data: {
				token: refreshToken,
				expiredAt: new Date(now.getTime() + 5 * 60 * 1000),
			},
		});
	}
	return { accessToken, refreshToken };
};

const logout = async (req) => {
	const refreshToken = req.cookies.refreshToken;

	if (!refreshToken) throw new ResponseError(204, "No Content");
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
	if (!account) throw new ResponseError(204, "No Content");
	const result = await prisma.refreshToken.delete({
		where: {
			email: account.email,
			token: account.token,
		},
	});
	if (!result) throw new ResponseError(400, "Oppss... Something wrong!");
	return result;
};
export default {
	register,
	emailVerify,
	resendEmailVerify,
	login,
	listUsers,
	logout,
};
