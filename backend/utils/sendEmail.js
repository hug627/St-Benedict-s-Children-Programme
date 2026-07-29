import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Verify SMTP connection when the server starts
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ Email configuration error:");
    console.error(error);
  } else {
    console.log("✅ Email server is ready.");
  }
});

export async function sendPasswordResetEmail(toEmail, resetLink) {
  try {
    console.log(`Sending password reset email to ${toEmail}`);

    const info = await transporter.sendMail({
      from: `"Company Name" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: "Reset your password",
      html: `
        <div style="font-family:Arial,sans-serif;max-width:500px;margin:auto">
          <h2>Reset Your Password</h2>

          <p>We received a request to reset your password.</p>

          <p>
            <a href="${resetLink}"
               style="background:#FAAA48;
                      color:#2F0F03;
                      padding:12px 20px;
                      text-decoration:none;
                      border-radius:6px;
                      display:inline-block;">
              Reset Password
            </a>
          </p>

          <p>If the button doesn't work, copy this link into your browser:</p>

          <p>${resetLink}</p>

          <p>This link expires in 1 hour.</p>

          <p>If you didn't request a password reset, you can safely ignore this email.</p>
        </div>
      `,
    });

    console.log("✅ Email sent successfully!");
    console.log(info.response);
  } catch (err) {
    console.error("❌ Failed to send email:");
    console.error(err);
    throw err;
  }
}
