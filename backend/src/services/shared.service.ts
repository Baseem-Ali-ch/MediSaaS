import { emailService } from "../config/mail";
import { prisma } from "../lib/prisma";
import { ActivityLogRepository } from "../repositories/activity-log.repository";
import { loadTemplate } from "../utils/template";

const activityLogRepo = new ActivityLogRepository(prisma);

export const sendVerificationUrl = async (email: string, token: string) => {
  const html = await loadTemplate("verify-email.html", {
    VERIFY_URL: `${process.env.FRONTEND_URL}/auth/verify-email?token=${token}`,
  });
  const transporter = emailService();
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "🔐 OTP Verification",
    html,
  });
};

export const sendResetPasswordLink = async (email: string, token: string) => {
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

export const sendInvitationEmail = async (
  staffName: string,
  email: string,
  password: string,
  token: string,
) => {
  const html = await loadTemplate("staff-invitation-mail.html", {
    STAFF_NAME: staffName,
    STAFF_EMAIL: email,
    TEMP_PASSWORD: password,
    INVITE_URL: `${process.env.FRONTEND_URL}/auth/login?invite-token=${token}`,
  });
  const transporter = await emailService();
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "You've been invited!",
    html,
  });
};

interface LogActivityParams {
  performedById: number;
  labId: number;
  branchId?: number | null;
  action: string;
  entity: string;
  message?: string;
  metadata?: Record<string, any> | null;
}

export const logActivity = async ({
  performedById,
  labId,
  branchId,
  action,
  entity,
  message,
  metadata,
}: LogActivityParams) => {
  await activityLogRepo.create({
    action,
    entity,
    message,
    metadata: metadata ? JSON.stringify(metadata) : null,
    performedBy: { connect: { id: performedById } },
    lab: { connect: { id: labId } },
    ...(branchId && {
      branch: {
        connect: { id: branchId },
      },
    }),
  });
};
