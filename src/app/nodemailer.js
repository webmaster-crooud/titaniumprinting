import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { oauth2Client } from "../libs/generateToken.js";
import { ResponseError } from "../errors/Response.error.js";
dotenv.config();

// Set Refresh Token
oauth2Client.setCredentials({
	refresh_token: process.env.REFRESH_TOKEN,
});

const createTransporter = async () => {
	try {
		const accessToken = await oauth2Client.getAccessToken();

		const transporter = nodemailer.createTransport({
			service: "gmail",
			auth: {
				type: "OAUTH2",
				user: process.env.CLIENT_EMAIL,
				clientId: process.env.CLIENT_ID,
				clientSecret: process.env.CLIENT_SECRET,
				refreshToken: process.env.REFRESH_TOKEN,
				accessToken: accessToken.token,
			},
		});

		await transporter.verify();
		return transporter;
	} catch (error) {
		throw new ResponseError(400, error);
	}
};

export const sendEmail = async (to, subject, html) => {
	try {
		const transporter = await createTransporter();
		const optionsEmail = {
			from: process.env.CLIENT_EMAIL,
			to,
			subject,
			html,
		};

		const result = await transporter.sendMail(optionsEmail);
		console.log("Email sent:", result.response);
		return result;
	} catch (error) {
		throw new ResponseError(400, error);
	}
};
