import { logger } from "./app/logger.js";
import { web } from "./app/web.js";
import dotenv from "dotenv";
import { sendEmail } from "./libs/mailersend.js";
dotenv.config();
dotenv.config({ path: ".env.production" });

// await sendEmail({
// 	email: "mikaeladityan.99@gmail.com",
// 	firstName: "Mikael",
// 	lastName: "Aditya Nugroho",
// 	subject: "Testing",
// 	content: "Testing",
// });
const port = process.env.APP_PORT || 3000;
web.listen(port, () => {
	logger.info(`Server is runnning on port ${process.env.APP_BASEURL}:${port}`);
});
