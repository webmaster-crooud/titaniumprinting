import express from "express";
import { errorMiddleware } from "../middlewares/error.middleware.js";
import cors from "cors";
import path from "path";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { apiRouter } from "../routes/api.routes.js";
import { appRoute } from "../routes/app.routes.js";
import { authRoutes } from "../routes/auth.routes.js";
import dotenv from "dotenv";
dotenv.config();
dotenv.config({ path: ".env.production" });
export const web = express();

console.log(process.env.APP_FRONTEND_HOME);
console.log(process.env.APP_FRONTEND_PANEL);
web.use(helmet());
web.use(
	cors({
		origin: [`${process.env.APP_FRONTEND_HOME}`, `${process.env.APP_FRONTEND_PANEL}`],
		methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
		allowedHeaders: [
			"Content-Type",
			"Authorization",
			"Set-Cookie", // Tambahkan ini
		],
		exposedHeaders: ["Set-Cookie"],
		credentials: true,
	})
);
// web.use(
// 	cors({
// 		origin: [process.env.APP_FRONTEND_HOME, process.env.APP_FRONTEND_PANEL],
// 		methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
// 		allowedHeaders: ["Content-Type", "Authorization", "Set-Cookie"],
// 		exposedHeaders: ["Set-Cookie"],
// 		credentials: true,
// 	})
// );
web.use(cookieParser());
web.use(express.json());

web.use("/api/auth", authRoutes);
web.use("/api/v1", apiRouter);
web.use("/api/public", appRoute);
web.use("/api/health", (req, res) => {
	res.status(200).json({
		message: "Health server 100% running",
		data: {
			server: "Connected",
			database: "Connected",
		},
	});
});

function sanitizeFilePath(filePath) {
	return path.normalize(filePath).replace(/^(\.\.[\/\\])+/, "");
}

web.get("/public/:folder/:filename", (req, res) => {
	const folder = sanitizeFilePath(req.params.folder);
	const filename = sanitizeFilePath(req.params.filename);

	const filePath = path.join(process.cwd(), "public", folder, filename);

	res.sendFile(filePath, (err) => {
		if (err) {
			res.status(404).json({
				error: true,
				message: "File not found",
			});
		}
	});
});

web.use((req, res) => {
	res.status(404).json({
		error: true,
		message: "Page is not found",
	});
});
web.use(errorMiddleware);
