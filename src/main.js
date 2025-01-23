import { logger } from "./app/logger.js";
import { web } from "./app/web.js";
import dotenv from "dotenv";
import scheduleTokenRefresh from "../src/libs/tokenScheduler.js";
dotenv.config();
dotenv.config({ path: ".env.production" });

scheduleTokenRefresh();
const port = process.env.APP_PORT || 3000;
web.listen(port, () => {
	logger.info(`Server is runnning on port ${process.env.APP_BASEURL}:${port}`);
});
