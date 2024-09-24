import { ResponseError } from "../errors/Response.error.js";

export const errorMiddleware = async (err, req, res, next) => {
	if (!err) {
		next();
		return;
	}
	if (err instanceof ResponseError) {
		res
			.status(err.status)
			.json({
				error: true,
				message: err.message,
			})
			.end();
	} else {
		res
			.status(500)
			.json({
				error: true,
				message: err.message,
			})
			.end();
	}
};
