import winston from "winston";

export const logger = winston.createLogger({
	level: "info",
	format: winston.format.json(),
	transports: [new winston.transports.Console({})],
});

export const errLogger = winston.createLogger({
	level: "error",
	format: winston.format.json(),
	transports: [new winston.transports.File({ filename: "./log/error.log" })],
});
