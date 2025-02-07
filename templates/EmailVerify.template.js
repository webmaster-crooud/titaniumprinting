import { formatTime } from "../src/libs/moment.js";

export const templateEmailVerify = (userData) => {
	return `
<!DOCTYPE html>
<html>
	<head>
		<meta charset="UTF-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	</head>
	<style>
		body {
			margin: 0;
			padding: 0;
			font-family: Arial, Helvetica, sans-serif;
		}
	</style>
	<body
		style="
			min-height: 500px;
			display: flex;
			align-items: center;
			justify-items: center;
			color: #1e293b;
			font-family: Arial, Helvetica, sans-serif;
			padding: 3.5rem 0;
		"
	>
		<div
			style="
				padding: 3rem;
				width: 35rem;
				background: #f1f5f9;
				border: 1 solid #475569;
				box-shadow: rgba(0, 0, 0, 0.45) 0px 25px 20px -20px;
				height: 100%;
				margin: 0 auto;
			"
		>
			<h1
				style="
					font-size: 1.5rem;
					font-weight: 500;
					line-height: 0.5rem;
					text-align: center;
				"
			>
				Titanium Printing
			</h1>
			<h1 style="font-size: 2rem; text-align: center; font-weight: 600">
				Aktivasi Email Pendaftaran Member
			</h1>

			<div
				style="
					border-top: solid 1px #475569;
					border-bottom: solid 1px #475569;
					padding: 1rem 0;
					margin: 1.75rem 0;
				"
			>
				<p style="margin-bottom: 3rem">
					Hi ${userData.firstName}, Silahkan klik tombol aktivasi email untuk melanjutkan
					proses pendaftaran member anda.
				</p>

				<div style="width: 100%; text-align: center;">
				<a
					href="${process.env.APP_BASEURL}
	/api/auth/email-verify/${userData.email}?token=${userData.token}"
					style="
						width: 60%;
						background-color: #3b82f6;
						margin: 0 auto;
						padding: 1rem 2.5rem;
						border-radius: 1rem;
						text-align: center;
						text-decoration: none;
						line-height: 0;
						color: #fff;
						font-weight: 600;
						font-size: 1.75rem;
						text-align: center;
						line-height: 0;
					"
				>
					Aktivasi Akun
				</a>
				</div>
				<p
					style="
						margin-top: 1rem;
						margin-bottom: 2.5rem;
						text-align: center;
						color: red;
						font-weight: 500;
					"
				>
					Expired: ${formatTime(userData.expiredAt)}
				</p>

				<p style="font-size: 15px">
					Jika tombol tidak berfungsi silahkan melanjutkan dengan link berikut:
					<a
						href="${process.env.APP_BASEURL}/api/auth/email-verify/${
		userData.email
	}?token=${userData.token}"
					>
						${process.env.APP_BASEURL}/api/auth/email-verify/${userData.email}?token=${
		userData.token
	}
					</a>
				</p>
			</div>
			<p style="margin-top: 1.5rem; color: #64748b; font-size: 14px">
				Abaikan pesan ini, jika anda memang tidak merasa melakukan pendaftaran
				Member di
				<a href="" style="text-decoration: none; color: #64748b"
					>Titanium Printing</a
				>
			</p>
			<p style="margin-top: 0.75rem; font-size: 14px; font-weight: 500">
				Hubungi:
				<a href="mailto:halo.titaniumprinting@gmail.com"
					>halo.titaniumprinting@gmail.com</a
				>
			</p>
		</div>
	</body>
</html>
`;
};
