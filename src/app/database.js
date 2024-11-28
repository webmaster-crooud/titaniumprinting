import { Prisma, PrismaClient } from "@prisma/client";
import { errLogger, logger } from "./logger.js";

export const prisma = new PrismaClient({
	log: [
		{
			emit: "event",
			level: "query",
		},
		{
			emit: "event",
			level: "error",
		},
		{
			emit: "event",
			level: "info",
		},
		{
			emit: "event",
			level: "warn",
		},
	],
	transactionOptions: {
		isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
		maxWait: 5000, // default: 2000
		timeout: 10000, // default: 5000
	},
});

prisma.$on("query", (e) => {
	console.log("Query: " + e.query);
	console.log("Params: " + e.params);
	console.log("Duration: " + e.duration + "ms");
});

prisma.$on("info", (e) => logger.info(e));
prisma.$on("warn", (e) => logger.warn(e));

prisma.$on("error", (e) =>
	errLogger.error(`"target": ${e.target}, message: ${e.message} `)
);
