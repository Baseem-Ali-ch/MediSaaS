import { emailService } from "../config/mail";
import { loadTemplate } from "../utils/template";



export const sendVerificationUrl = async (email: string, token: string) => {
  const html = await loadTemplate("verify-email.html", {
    VERIFY_URL: `${process.env.FRONTEND_URL}/auth/verify-email?token=${token}`,
  });
  const transporter = await emailService();
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "🔐 OTP Verification",
    html,
  });
};

export const sendResetPasswordLink = async (
  email: string,
  token: string
) => {
  const html = await loadTemplate("reset-password.html", {
    RESET_URL: `${process.env.FRONTEND_URL}/auth/reset-password?token=${token}`,
  });
  const transporter = await emailService();
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Reset Your Password",
    html,
  });
};
