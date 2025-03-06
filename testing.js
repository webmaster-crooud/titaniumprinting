import nodemailer from "nodemailer";
import dotenv from "dotenv";
import EmailService from "/src/app/nodemailer.js";
dotenv.config();

const accessToken = EmailService.getAccessToken();
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

transporter
	.sendMail({
		from: process.env.CLIENT_EMAIL,
		to: "mikaeladityan.99@gmail.com",
		subject: "Test Email",
		text: "This is a test email.",
	})
	.then(() => console.log("Email sent successfully!"))
	.catch((error) => console.error("Error sending email:", error));
