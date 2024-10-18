import { logger } from "./app/logger.js";
import { web } from "./app/web.js";
import dotenv from "dotenv";
dotenv.config();

const port = process.env.APP_PORT || 3000;
web.listen(port, () => {
	logger.info(`Server is runnning on port: http://127.0.0.1:${port}`);
});
