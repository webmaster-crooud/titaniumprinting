import { MailerSend, EmailParams, Sender, Recipient } from "mailersend";
import { config } from "dotenv";
config();

export async function sendEmail({
	email,
	firstName,
	lastName,
	subject,
	content,
}) {
	try {
		const mailerSend = new MailerSend({
			apiKey: process.env.MAILERSEND_KEY,
		});

		const sentFrom = new Sender(process.env.COMPANY_MAIL, "Titanium Printing");

		const recipients = [new Recipient(email, `${firstName} ${lastName}`)];

		const emailParams = new EmailParams()
			.setFrom(sentFrom)
			.setTo(recipients)
			.setReplyTo(sentFrom)
			.setSubject(subject)
			.setHtml(content);

		await mailerSend.email.send(emailParams);
		console.log("Email sent successfully");
	} catch (error) {
		console.error("Failed to send email:", error);
		throw error;
	}
}

// export async function emailService({
// 	email,
// 	firstName,
// 	lastName,
// 	contentHtml,
// 	subject,
// }) {
// 	//   // Render React template to HTML
// 	//   const emailHtml = render(
// 	//     <OTPEmail
// 	//       otp={otp}
// 	//       firstName={firstName}
// 	//       companyName={companyName}
// 	//       companyAddress={companyAddress}
// 	//     />
// 	//   );

// 	// Send email using your existing function
// 	await sendEmail({
// 		email,
// 		firstName,
// 		lastName,
// 		subject,
// 		content: contentHtml,
// 	});
// }
