import express from "express";
import { errorMiddleware } from "../middlewares/error.middleware.js";
import { apiRouter } from "../routes/api.route.js";

export const web = express();

web.use(express.json());

web.use("/api/v1", apiRouter);
web.use("/api/health", (req, res) => {
	res.status(200).json({
		message: "Health server 100% running",
		data: {
			server: "Connected",
			database: "Connected",
		},
	});
});
web.use((req, res) => {
	res.status(404).json({
		erros: true,
		message: "Page is not found",
	});
});
web.use(errorMiddleware);
