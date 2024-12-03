import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { ResponseError } from "../errors/Response.error.js";
dotenv.config();

export const verifyToken = (req, res, next) => {
	const authHeader = req.headers["authorization"];
	const token = authHeader && authHeader.split(" ")[1];
	if (token === null) throw new ResponseError(401, "Unauthorization");

	try {
		jwt.verify(token, process.env.JWT_ACCESS_TOKEN, (err, decoded) => {
			if (err) throw new ResponseError(403, "Forbidden");
			req.email = decoded.email;
			next();
		});
	} catch (error) {
		next(error);
	}
};
