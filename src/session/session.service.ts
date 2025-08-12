import nodemailer from "nodemailer";
import config from "./session.config";

export async function sendRecoveryPassword(
  receiverEmail: string,
  endpoint: string
) {
  const smtp = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: config.emailSender,
      pass: config.emailPassword,
    },
  });

  const emailSkeleton = `
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  </head>
  <body>
    <section style="width: 100%; padding: 2em 1em; font-family: 'Segoe UI', Arial, sans-serif; box-sizing: border-box; background-color: #f4f4f4;">
      <div style="margin: 0 auto; max-width: 600px; background: #fff; border-radius: 8px; padding: 2em; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);">
        <h1 style="text-align: center; margin-bottom: 1.5em; color: #222; font-size: 1.8em; border-bottom: 1px solid #e0e0e0; padding-bottom: 0.5em;">Password Recovery</h1>

        <p style="text-align: center; color: #555; line-height: 1.5">We received a request to reset the password for your account. Click the button below to choose a new password. For your security, this link will expire in 15 minutes.</p>

        <a href="${endpoint}" style="display: block; font-size: 1em; color: #fff; margin: 2em auto 0 auto; background: #333; border-radius: 0.5em; padding: 1em; width: fit-content; text-decoration: none">Reset your password</a>

        <hr style="border: none; border-top: 1px solid #eee; margin: 2em 0;" />

        <p style="text-align: center; line-height: 1.5; font-size: 1em; color: #555;">If the button doesn't work, copy and paste the following URL into your browser:</p>

        <a href="${endpoint}" style="display: grid; color: blue; text-decoration: none; text-align: center; margin-top: 1em; background: #eef; padding: 1em; border-radius: 0.5em">${endpoint}</a>

        <p style="text-align: center; line-height: 1.5; font-size: 1em; color: #555; margin-top: 1em">If you didn't request a password reset, you can safely ignore this email — no changes will be made to your account.</p>

        <hr style="border: none; border-top: 1px solid #eee; margin: 2em 0;" />

        <p style="text-align: center; line-height: 1.5; font-size: .9em; color: #555;">Need help? Reply to this email or contact our support team.</p>
      </div>
    </section>
  </body>
</html>
  `;

  await smtp.sendMail({
    from: config.emailSender,
    to: receiverEmail,
    subject: "Password Recovery",
    html: emailSkeleton,
    text: `We received a request to reset your password. Use the link below within 15 minutes:\n${endpoint}`,
  });

  smtp.close();
}
