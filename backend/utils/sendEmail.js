import { Resend } from "resend";

// Initializes Resend using your secret environment variable
const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendPasswordResetEmail(toEmail, resetLink) {
  try {
    console.log(`Sending password reset email via Resend API to: ${toEmail}`);

    const data = await resend.emails.send({
      from: "onboarding@resend.dev", // Default test sender provided by Resend
      to: toEmail,
      subject: "Reset your password",
      html: `
        <div style="font-family:Arial,sans-serif;max-width:500px;margin:auto;padding:20px;border:1px solid #eee;border-radius:8px;">
          <h2 style="color:#2F0F03;">Reset Your Password</h2>

          <p>We received a request to reset your password for St Benedict's Children Programme.</p>

          <p style="margin:24px 0;">
            <a href="${resetLink}"
               style="background:#FAAA48;
                      color:#2F0F03;
                      padding:12px 20px;
                      text-decoration:none;
                      border-radius:6px;
                      font-weight:bold;
                      display:inline-block;">
              Reset Password
            </a>
          </p>

          <p>If the button doesn't work, copy and paste this link into your browser:</p>

          <p style="word-break:break-all;color:#0066cc;">${resetLink}</p>

          <p style="font-size:12px;color:#666;">This link expires in 1 hour.</p>

          <p style="font-size:12px;color:#666;">If you didn't request a password reset, you can safely ignore this email.</p>
        </div>
      `,
    });

    console.log("✅ Email sent successfully via Resend:", data);
    return data;
  } catch (err) {
    console.error("❌ Failed to send email via Resend:", err);
    throw err;
  }
}
