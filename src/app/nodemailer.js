import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { OAuth2Client } from "google-auth-library";
import { PrismaClient } from "@prisma/client";
import { ResponseError } from "../errors/Response.error.js";

dotenv.config();

const prisma = new PrismaClient();

class EmailService {
	constructor() {
		this.oauth2Client = new OAuth2Client(
			process.env.CLIENT_ID,
			process.env.CLIENT_SECRET,
			process.env.REDIRECT_URL
		);
		this.initializeOauthClient();
	}

	async initializeOauthClient() {
		// Ambil refreshToken dari database
		const tokenData = await prisma.token.findFirst();
		if (!tokenData) {
			throw new ResponseError(
				404,
				"Refresh token tidak ditemukan di database."
			);
		}

		this.oauth2Client.setCredentials({
			refresh_token: tokenData.refreshToken,
		});
	}

	async getAccessToken() {
		try {
			// Ambil accessToken dari database
			const tokenData = await prisma.token.findFirst();

			if (tokenData && tokenData.accessToken) {
				return tokenData.accessToken;
			}

			// Jika tidak ada accessToken, refresh dan simpan
			const newAccessToken = await this.refreshAccessToken();
			return newAccessToken;
		} catch (error) {
			console.error("Error getting access token:", error);
			throw error;
		}
	}

	async refreshAccessToken() {
		try {
			const { credentials } = await this.oauth2Client.refreshAccessToken();

			// Simpan token baru ke database
			await prisma.token.update({
				where: { id: 1 },
				data: {
					accessToken: credentials.access_token,
					refreshToken: credentials.refresh_token || undefined,
				},
			});

			console.log("Token berhasil diperbarui:", credentials);
			return credentials.access_token;
		} catch (error) {
			console.error("Error refreshing access token:", error);

			// Jika refresh token invalid
			if (error.response && error.response.status === 400) {
				throw new ResponseError(
					500,
					"Refresh token tidak valid. Perlu otorisasi ulang."
				);
			}

			throw error;
		}
	}

	async createTransporter() {
		try {
			const accessToken = await this.getAccessToken();

			const transporter = nodemailer.createTransport({
				service: "gmail",
				auth: {
					type: "OAUTH2",
					user: process.env.CLIENT_EMAIL,
					clientId: process.env.CLIENT_ID,
					clientSecret: process.env.CLIENT_SECRET,
					refreshToken: (await prisma.token.findFirst()).refreshToken,
					accessToken,
				},
			});

			await transporter.verify();
			return transporter;
		} catch (error) {
			console.error("Error creating transporter:", error);
			throw new ResponseError(400, error.message);
		}
	}

	async sendEmail(to, subject, html) {
		try {
			const transporter = await this.createTransporter();
			const result = await transporter.sendMail({
				from: process.env.CLIENT_EMAIL,
				to,
				subject,
				html,
			});

			console.log("Email sent:", result.response);
			return result;
		} catch (error) {
			console.error("Error sending email:", error);
			throw new ResponseError(400, error.message);
		}
	}
}

export default new EmailService();
