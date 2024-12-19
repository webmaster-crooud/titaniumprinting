// import nodemailer from "nodemailer";
// import dotenv from "dotenv";
// import fs from "fs";
// import { OAuth2Client } from "google-auth-library";
// import { ResponseError } from "../errors/Response.error.js";

// dotenv.config();

// class EmailService {
// 	constructor() {
// 		// Inisialisasi OAuth2 Client
// 		this.oauth2Client = new OAuth2Client(
// 			process.env.CLIENT_ID,
// 			process.env.CLIENT_SECRET,
// 			process.env.REDIRECT_URL
// 		);

// 		this.initializeOauthClient();
// 	}

// 	initializeOauthClient() {
// 		// Set kredensial awal dengan refresh token dari environment
// 		this.oauth2Client.setCredentials({
// 			refresh_token: process.env.REFRESH_TOKEN,
// 		});
// 	}

// 	async getAccessToken() {
// 		try {
// 			// Coba dapatkan access token
// 			const { token } = await this.oauth2Client.getAccessToken();

// 			if (!token) {
// 				// Jika token tidak tersedia, refresh token
// 				await this.refreshAccessToken();
// 				const newToken = await this.oauth2Client.getAccessToken();
// 				return newToken.token;
// 			}

// 			return token;
// 		} catch (error) {
// 			console.error("Error getting access token:", error);

// 			// Jika error, coba refresh token
// 			await this.refreshAccessToken();
// 			const newToken = await this.oauth2Client.getAccessToken();
// 			return newToken.token;
// 		}
// 	}

// 	async refreshAccessToken() {
// 		try {
// 			// Dapatkan kredensial baru
// 			const { credentials } = await this.oauth2Client.refreshAccessToken();

// 			// Update kredensial di OAuth client
// 			this.oauth2Client.setCredentials(credentials);

// 			// Update refresh token di environment jika berubah
// 			if (credentials.refresh_token) {
// 				await this.updateEnvironmentRefreshToken(credentials.refresh_token);
// 			}

// 			console.log("Token berhasil diperbarui");
// 		} catch (error) {
// 			console.error("Gagal refresh token:", error);

// 			// Jika refresh token sudah tidak valid
// 			if (error.response && error.response.status === 400) {
// 				// Generate URL untuk otorisasi ulang
// 				const scopes = [
// 					"https://mail.google.com/",
// 					"https://www.googleapis.com/auth/gmail.send",
// 				];

// 				const url = this.oauth2Client.generateAuthUrl({
// 					access_type: "offline",
// 					scope: scopes,
// 					prompt: "consent",
// 				});

// 				console.error(
// 					"Refresh token tidak valid. Silakan buka URL untuk otorisasi ulang:"
// 				);
// 				console.error(url);

// 				throw new ResponseError(
// 					500,
// 					"Perlu otorisasi ulang. Buka URL yang diberikan."
// 				);
// 			}

// 			throw error;
// 		}
// 	}

// 	async updateEnvironmentRefreshToken(newRefreshToken) {
// 		try {
// 			// Baca file .env
// 			const envFile = ".env";
// 			const envContents = fs.readFileSync(envFile, "utf8");

// 			// Ganti refresh token
// 			const updatedEnv = envContents.replace(
// 				/REFRESH_TOKEN=.*/,
// 				`REFRESH_TOKEN="${newRefreshToken}"`
// 			);

// 			// Tulis ulang file .env
// 			fs.writeFileSync(envFile, updatedEnv);

// 			// Update environment variable saat ini
// 			process.env.REFRESH_TOKEN = newRefreshToken;
// 		} catch (error) {
// 			console.error("Gagal update refresh token di environment:", error);
// 		}
// 	}

// 	async createTransporter() {
// 		try {
// 			const accessToken = await this.getAccessToken();

// 			const transporter = nodemailer.createTransport({
// 				service: "gmail",
// 				auth: {
// 					type: "OAUTH2",
// 					user: process.env.CLIENT_EMAIL,
// 					clientId: process.env.CLIENT_ID,
// 					clientSecret: process.env.CLIENT_SECRET,
// 					refreshToken: process.env.REFRESH_TOKEN,
// 					accessToken: accessToken,
// 				},
// 			});

// 			await transporter.verify();
// 			return transporter;
// 		} catch (error) {
// 			console.error("Gagal membuat transporter:", error);
// 			throw new ResponseError(400, error);
// 		}
// 	}

// 	async sendEmail(to, subject, html) {
// 		try {
// 			const transporter = await this.createTransporter();
// 			const optionsEmail = {
// 				from: process.env.CLIENT_EMAIL,
// 				to,
// 				subject,
// 				html,
// 			};

// 			const result = await transporter.sendMail(optionsEmail);
// 			console.log("Email terkirim:", result.response);
// 			return result;
// 		} catch (error) {
// 			console.error("Gagal mengirim email:", error);
// 			throw new ResponseError(400, error);
// 		}
// 	}
// }

// export default new EmailService();

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
