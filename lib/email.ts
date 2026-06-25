import { formatScore, type AssessmentResult } from "@/lib/scoring";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(email: string): boolean {
  return emailPattern.test(email.trim());
}

export function buildEmailSubject(result: AssessmentResult): string {
  return `디지털 역량 진단 결과 (${result.level}, ${formatScore(result.overallScore)}점)`;
}

export async function sendResultEmail(email: string, summary: string, subject: string): Promise<void> {
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
      to: [email.trim()],
      subject,
      text: summary,
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(detail || "EMAIL_SEND_FAILED");
  }
}
