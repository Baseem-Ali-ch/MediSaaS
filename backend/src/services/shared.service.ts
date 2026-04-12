import { GoogleGenAI } from "@google/genai";
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

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});
// ─── helpers ────────────────────────────────────────────────────────────────

function getStatus(
  value: string,
  range: string | null,
): "HIGH" | "LOW" | "NORMAL" | "UNKNOWN" {
  if (!range || !value) return "UNKNOWN";
  const [min, max] = range.split("-").map(Number);
  const num = parseFloat(value);
  if (isNaN(num) || isNaN(min) || isNaN(max)) return "UNKNOWN";
  if (num < min) return "LOW";
  if (num > max) return "HIGH";
  return "NORMAL";
}

interface Parameter {
  name: string;
  unit: string;
  referenceRange: string;
  resultType: string;
  resultValue?: string; // filled in from testResult.result
}

function parseParameters(raw: string | null | undefined): Parameter[] {
  if (!raw) return [];
  try {
    // your API stores parameters as a double-encoded JSON string — unwrap it
    let str: any = raw;
    while (
      typeof str === "string" &&
      (str.startsWith('"') || str.startsWith('\\"'))
    ) {
      str = JSON.parse(str);
    }
    const parsed = typeof str === "string" ? JSON.parse(str) : str;
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

// ─── types ───────────────────────────────────────────────────────────────────

interface TestResult {
  testId: number;
  result: string;
  test: {
    testName: string;
    category: string;
    sampleType: string;
    unit: string | null;
    referenceRange: string | null;
    parameters: string; // raw JSON string from API
  };
}

// ─── system prompt ────────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `You are a friendly health assistant helping patients understand their lab test results.
Your job is to explain what a test result means in plain, simple English that anyone can understand — no medical jargon.

Rules you must always follow:
- Use simple, everyday words. Avoid or explain any medical terms.
- Keep the suggestion short: 2 to 4 sentences maximum.
- Be warm, calm, and reassuring — never scary or alarming.
- Always mention what the patient can do to improve or maintain the result.
- Never diagnose any disease. Never replace a doctor's advice.
- End every suggestion with: "Please talk to your doctor for personalised advice."`;

// ─── single test suggestion ───────────────────────────────────────────────────

export async function AITestReportSuggestion(
  testResult: TestResult,
): Promise<string> {
  const { test, result } = testResult;

  if (!test) return "No test information available for analysis.";

  const parameters = parseParameters(test.parameters);

  // ── Multi Parameter test: build one prompt covering all params ──
  if (parameters.length > 0) {
    const paramLines = parameters
      .map((param) => {
        const status = getStatus(result, param.referenceRange);
        return `  - ${param.name}: ${result} ${param.unit}  |  Normal: ${param.referenceRange}  |  Status: ${status}`;
      })
      .join("\n");

    const prompt = `${SYSTEM_PROMPT}

A patient has received the following lab test result. Please give a simple, easy-to-understand health suggestion.

Test Name: ${test.testName}
Category: ${test.category}
Sample Type: ${test.sampleType}
Parameters:
${paramLines}

Write a suggestion that:
1. Tells the patient what these results mean in simple words (1 sentence)
2. Mentions common everyday reasons this can happen (1 sentence)
3. Suggests simple lifestyle steps they can take (1 sentence)
4. Ends with: "Please talk to your doctor for personalised advice."`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return response.text?.trim() ?? "No AI suggestion available";
  }

  // ── Single / Numeric test: simple prompt ──
  const status = getStatus(result, test.referenceRange);

  const prompt = `${SYSTEM_PROMPT}

A patient has received the following lab test result. Please give a simple, easy-to-understand health suggestion.

Test Name: ${test.testName}
Category: ${test.category}
Sample Type: ${test.sampleType}
Patient's Result: ${result} ${test.unit ?? ""}
Normal Range: ${test.referenceRange ?? "N/A"}
Result Status: ${status}

Write a suggestion that:
1. Tells the patient what this result means in simple words (1 sentence)
2. Mentions common everyday reasons this can happen (1 sentence)
3. Suggests simple lifestyle steps they can take (1 sentence)
4. Ends with: "Please talk to your doctor for personalised advice."`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

  return response.text?.trim() ?? "No AI suggestion available";
}

// ─── multiple test suggestions (parallel) ────────────────────────────────────

export async function AIMultipleTestSuggestions(
  testResults: TestResult[],
): Promise<{ testId: number; testName: string; suggestion: string }[]> {
  const results = await Promise.all(
    testResults.map(async (tr) => ({
      testId: tr.testId,
      testName: tr.test.testName,
      suggestion: await AITestReportSuggestion(tr),
    })),
  );
  return results;
}

// ─── holistic suggestion (all tests in one call) ──────────────────────────────

export async function AIHolisticSuggestion(
  testResults: TestResult[],
  patientName: string,
): Promise<string> {
  const testLines = testResults
    .filter((tr) => tr.test) // Ensure test metadata exists
    .map((tr, i) => {
      const parameters = parseParameters(tr.test.parameters);
      if (parameters.length > 0) {
        const paramLines = parameters
          .map(
            (p) =>
              `    • ${p.name}: ${tr.result} ${p.unit}  (Normal: ${p.referenceRange})  → ${getStatus(tr.result, p.referenceRange)}`,
          )
          .join("\n");
        return `Test ${i + 1}: ${tr.test.testName} (${tr.test.category})\n${paramLines}`;
      }
      return `Test ${i + 1}: ${tr.test.testName} (${tr.test.category})
    Result: ${tr.result} ${tr.test.unit ?? ""}  |  Normal: ${tr.test.referenceRange ?? "N/A"}  |  Status: ${getStatus(tr.result, tr.test.referenceRange)}`;
    })
    .join("\n\n");

  const prompt = `${SYSTEM_PROMPT}

Patient: ${patientName}
Here are all the lab test results for this patient:

${testLines}

Please give a simple overall health suggestion:
1. Summarise what these results suggest together in 1-2 sentences (plain language)
2. Mention any patterns or related things the patient should know (1 sentence)
3. Give 2-3 simple lifestyle steps the patient can take
4. End with: "Please talk to your doctor for personalised advice."`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

  return response.text?.trim() ?? "No AI suggestion available";
}
