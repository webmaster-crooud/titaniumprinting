import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { oauth2Client } from "../libs/generateToken.js";
import { ResponseError } from "../errors/Response.error.js";

dotenv.config();

class EmailService {
	constructor() {
		this.initializeOauthClient();
	}

	initializeOauthClient() {
		oauth2Client.setCredentials({
			refresh_token: process.env.REFRESH_TOKEN,
		});
	}

	async getAccessToken() {
		try {
			const accessToken = await oauth2Client.getAccessToken();

			// Jika access token tidak tersedia, regenerasi
			if (!accessToken.token) {
				await this.regenerateAccessToken();
				return await oauth2Client.getAccessToken();
			}

			return accessToken.token;
		} catch (error) {
			console.error("Error getting access token:", error);
			await this.regenerateAccessToken();
			return await oauth2Client.getAccessToken();
		}
	}

	async regenerateAccessToken() {
		try {
			// Implementasikan logika untuk mendapatkan refresh token baru
			// Ini bisa melibatkan proses interaktif atau menggunakan API Google
			const newCredentials = await this.requestNewCredentials();

			oauth2Client.setCredentials({
				refresh_token: newCredentials.refreshToken,
			});

			// Update refresh token di environment atau database
			process.env.REFRESH_TOKEN = newCredentials.refreshToken;

			// Simpan refresh token baru (opsional: gunakan metode penyimpanan yang aman)
			await this.saveRefreshToken(newCredentials.refreshToken);
		} catch (error) {
			console.error("Gagal mendapatkan refresh token baru:", error);
			throw new ResponseError(500, "Gagal mendapatkan kredensial baru");
		}
	}

	async requestNewCredentials() {
		// PENTING: Implementasi aktual tergantung pada alur otorisasi Anda
		// Contoh sederhana, Anda perlu menggantinya dengan logika regenerasi yang sesuai
		throw new Error("Implementasi requestNewCredentials harus disesuaikan");
	}

	async saveRefreshToken(refreshToken) {
		// Implementasi penyimpanan refresh token
		// Contoh: menyimpan ke file, database, atau layanan penyimpanan rahasia
		console.log("Menyimpan refresh token baru");
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
					refreshToken: process.env.REFRESH_TOKEN,
					accessToken: accessToken,
				},
			});

			await transporter.verify();
			return transporter;
		} catch (error) {
			console.error("Gagal membuat transporter:", error);
			throw new ResponseError(400, error);
		}
	}

	async sendEmail(to, subject, html) {
		try {
			const transporter = await this.createTransporter();
			const optionsEmail = {
				from: process.env.CLIENT_EMAIL,
				to,
				subject,
				html,
			};

			const result = await transporter.sendMail(optionsEmail);
			console.log("Email terkirim:", result.response);
			return result;
		} catch (error) {
			console.error("Gagal mengirim email:", error);
			throw new ResponseError(400, error);
		}
	}
}

export default new EmailService();
