import cron from "node-cron";
import EmailService from "../app/nodemailer.js";

const scheduleTokenRefresh = () => {
	// Jadwal refresh token setiap 1 jam
	cron.schedule("50 * * * *", async () => {
		try {
			console.log("Running scheduled token refresh...");
			await EmailService.refreshAccessToken();
			console.log("Token successfully refreshed.");
		} catch (error) {
			console.error("Error refreshing token during cron job:", error.message);
		}
	});
};

export default scheduleTokenRefresh;
