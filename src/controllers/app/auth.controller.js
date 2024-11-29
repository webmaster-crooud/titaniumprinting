import { templateEmailVerify } from "../../../templates/EmailVerify.template.js";
import { ResponseError } from "../../errors/Response.error.js";
import authService from "../../services/app/auth.service.js";
import dotenv from "dotenv";
import EmailService from "../../app/nodemailer.js";
dotenv.config();

const listUserController = async (req, res, next) => {
	try {
		console.log(req.email);
		const result = await authService.listUsers();
		res.status(200).json({
			data: result,
		});
	} catch (error) {
		next(error);
	}
};

const registerController = async (req, res, next) => {
	try {
		const result = await authService.register(req);
		const userData = {
			email: result.email,
			firstName: result.firstName,
			lastName: result.lastName,
			role: result.role,
			ip: result.account.ipAddress,
			status: result.account.status,
			userAgent: result.account.userAgent,
			token: result.emailVerify.token,
			type: result.emailVerify.type,
			expiredAt: result.emailVerify.expiredAt,
		};

		const html = templateEmailVerify(userData);
		const to = userData.email;
		const subject = "Aktivasi Pendaftaran Akun Member Titanium Printing";
		await EmailService.sendEmail(to, subject, html);

		res.status(201).json({
			message: "OK",
			data: userData,
		});
	} catch (error) {
		next(error);
	}
};

const emailVerifyController = async (req, res, next) => {
	const { email } = req.params;
	const { token } = req.query;

	const request = {
		email: email,
		token: token,
	};

	try {
		const result = await authService.emailVerify(request);

		res.redirect(
			`${process.env.APP_FRONTEND}/login?status=success&message=Congrats! Successfully to ${result.status} Email ${result.email}`
		);
	} catch (error) {
		res.redirect(
			`${process.env.APP_FRONTEND}/login?status=error&message=${error}`
		);
		// next(error);
	}
};

const resendEmailVerify = async (req, res, next) => {
	const { email } = req.params;
	if (!email) throw new ResponseError(400, "Email is not defined");
	try {
		const result = await authService.resendEmailVerify(email);
		const userData = {
			email: result.email,
			firstName: result.user.firstName,
			lastName: result.user.lastName,
			token: result.token,
			expiredAt: result.expiredAt,
		};

		const html = templateEmailVerify(userData);
		const to = userData.email;
		const subject = "Aktivasi Pendaftaran Akun Member Titanium Printing";
		await EmailService.sendEmail(to, subject, html);
		res.status(201).json({
			message: `Successfully to sending new email confirmation to ${result.email}`,
		});
	} catch (error) {
		next(error);
	}
};

const loginController = async (req, res, next) => {
	try {
		const request = req.body;

		if (!request.email && !request.username)
			throw new ResponseError(400, "Bad Request");

		const result = await authService.login(request);
		console.log(result);
		res.cookie("refreshToken", result.refreshToken, {
			httpOnly: true,
			maxAge: 24 * 60 * 60 * 1000,
			// secure: true, // production only
		});
		res.status(200).json({
			message: "Successfully login",
			data: result.accessToken,
		});
	} catch (error) {
		next(error);
	}
};

const logoutController = async (req, res, next) => {
	try {
		await authService.logout(req);
		res.clearCookie("refreshToken");
		res.status(200).json({
			message: "Successfully logout",
		});
	} catch (error) {
		next(error);
	}
};

export default {
	registerController,
	emailVerifyController,
	resendEmailVerify,
	loginController,
	listUserController,
	logoutController,
};
