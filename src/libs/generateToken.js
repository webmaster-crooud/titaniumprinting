import { google } from "googleapis";
import dotenv from "dotenv";
dotenv.config();
dotenv.config({ path: ".env.production" });

export const oauth2Client = new google.auth.OAuth2(
	process.env.CLIENT_ID,
	process.env.CLIENT_SECRET,
	process.env.REDIRECT_URL
);

const newTokens = () => {
	const GMAIL_SCOPES = [
		"https://mail.google.com/",
		"https://www.googleapis.com/auth/gmail.send",
		"https://www.googleapis.com/auth/gmail.compose",
	];

	const url = oauth2Client.generateAuthUrl({
		access_type: "offline",
		scope: GMAIL_SCOPES,
		prompt: "consent",
	});
	console.log("Authorize this app by visiting this url:", url);
};

// newTokens();
