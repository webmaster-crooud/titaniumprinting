import express from "express";
import { errorMiddleware } from "../middlewares/error.middleware.js";
import { apiRouter } from "../routes/api.route.js";
import cors from "cors";
import path from "path";
import { appRoute } from "../routes/app.route.js";
import { rajaRouter } from "../routes/rajaongkir.route.js";

export const web = express();

web.use(express.json());
web.use(
	cors({
		origin: ["http://localhost:3000", "http://localhost:5173"],
		credentials: true,
	})
);
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
