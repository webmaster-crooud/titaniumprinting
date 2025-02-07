export function OTPSenderTemplate(
	firstName,
	otp,
	companyName = "Titanium Printing",
	companyAddress = "Jl Raya Granit Nila 12D A14 KBD, Kec. Driyorejo, Kab. Gresik",
	companyPostalCode = "Indonesia, 61177"
) {
	return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                body {
                    font-family: Arial, sans-serif;
                    line-height: 1.6;
                    margin: 0;
                    padding: 0;
                    background-color: #f4f4f4;
                }
                .container {
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                    background-color: #ffffff;
                }
                .header {
                    text-align: left;
                    margin-bottom: 30px;
                }
                .otp-code {
                    text-align: center;
                    font-size: 32px;
                    font-weight: bold;
                    letter-spacing: 8px;
                    margin: 30px 0;
                    color: #333;
                }
                .footer {
                    margin-top: 30px;
                    text-align: left;
                    color: #666;
                    font-size: 14px;
                }
                .social-links {
                    margin-top: 20px;
                }
                .social-links img {
                    margin-right: 10px;
                    width: 24px;
                    height: 24px;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <img src="https://laborare.my.id/assets/laborare.png" alt="${companyName}" height="40">
                    <h1 style="font-size: 14px">${companyName}</h1>
                </div>

                <h1>Pendaftaran Member Berhasil!</h1>
                
                <p>Halo ${firstName},</p>
                <p>Berikut adalah kode OTP Anda:</p>
                
                <div class="otp-code">
                    ${otp}
                </div>
                
                <p>Kode OTP ini akan kadaluarsa dalam 5 menit.</p>
                <p>Jika Anda tidak merasa melakukan permintaan ini, silakan abaikan email ini.</p>

                <div class="footer">
                    <p>${companyName}</p>
                    <p>${companyAddress}</p>
                    <p>${companyPostalCode}</p>
                    
                    <div class="social-links">
                        <a href="#"><img src="[Facebook Icon URL]" alt="Facebook"></a>
                        <a href="#"><img src="[Twitter Icon URL]" alt="Twitter"></a>
                        <a href="#"><img src="[Instagram Icon URL]" alt="Instagram"></a>
                    </div>
                </div>
            </div>
        </body>
        </html>
    `;
}
