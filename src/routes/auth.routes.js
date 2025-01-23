import express from "express";
import { oauth2Client } from "../libs/generateToken.js";
import authController from "../controllers/app/auth.controller.js";
import { refreshToken } from "../controllers/app/refreshToken.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
export const authRoutes = express.Router();

const GMAIL_SCOPES = [
	"https://mail.google.com/",
	"https://www.googleapis.com/auth/gmail.send",
	"https://www.googleapis.com/auth/gmail.compose",
];
authRoutes.get("/", (req, res) => {
	const authUrl = oauth2Client.generateAuthUrl({
		access_type: "offline",
		scope: GMAIL_SCOPES,
	});
	res.redirect(authUrl);
});

authRoutes.get("/callback", async (req, res) => {
	const { code } = req.query;

	// Tukar authorization code dengan access token dan refresh token
	try {
		const { tokens } = await oauth2Client.getToken(code);
		oauth2Client.setCredentials(tokens);

		res.status(200).json({
			Access: tokens.access_token,
			Refresh: tokens.refresh_token,
		});
	} catch (error) {
		console.error("Error getting tokens:", error);
		res.send("Error occurred while getting tokens");
	}
});

authRoutes.get("/users", authController.listUserController);
authRoutes.post("/login", authController.loginController);
authRoutes.post("/register", authController.registerController);
authRoutes.patch("/email-verify/:email", authController.resendEmailVerify);
authRoutes.get("/email-verify/:email", authController.emailVerifyController);
authRoutes.get("/token", refreshToken);
authRoutes.delete("/logout", authController.logoutController);
