import { formatScore, type AssessmentResult } from "@/lib/scoring";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(email: string): boolean {
  return emailPattern.test(email.trim());
}

export function buildEmailSubject(result: AssessmentResult): string {
  return `디지털 역량 진단 결과 (${result.level}, ${formatScore(result.overallScore)}점)`;
}

async function sendEmail(to: string, subject: string, text: string): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;

  if (!apiKey || !from) {
    throw new Error("EMAIL_NOT_CONFIGURED");
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to.trim()],
      subject,
      text,
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(detail || "EMAIL_SEND_FAILED");
  }
}

export async function sendResultEmail(email: string, summary: string, subject: string): Promise<void> {
  await sendEmail(email, subject, summary);
}

export async function sendAdminPasswordResetEmail(email: string, resetUrl: string): Promise<void> {
  const text = [
    "관리자 비밀번호 재설정을 요청하셨습니다.",
    "",
    "아래 링크에서 새 비밀번호를 설정해 주세요. (30분간 유효)",
    resetUrl,
    "",
    "본인이 요청하지 않았다면 이 이메일을 무시해 주세요.",
  ].join("\n");

  await sendEmail(email, "디지털 역량 진단 관리자 비밀번호 재설정", text);
}
