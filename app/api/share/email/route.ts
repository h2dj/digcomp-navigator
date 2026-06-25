import { buildEmailSubject, isValidEmail, sendResultEmail } from "@/lib/email";
import { formatResultSummary } from "@/lib/result-share";
import type { AssessmentResult } from "@/lib/scoring";

type EmailRequestBody = {
  email?: string;
  result?: AssessmentResult;
};

export async function POST(request: Request) {
  let body: EmailRequestBody;

  try {
    body = (await request.json()) as EmailRequestBody;
  } catch {
    return Response.json({ error: "요청 형식이 올바르지 않습니다." }, { status: 400 });
  }

  const email = body.email?.trim() ?? "";
  if (!isValidEmail(email)) {
    return Response.json({ error: "올바른 이메일 주소를 입력해주세요." }, { status: 400 });
  }

  if (!body.result?.id) {
    return Response.json({ error: "전송할 결과가 없습니다." }, { status: 400 });
  }

  const summary = formatResultSummary(body.result);
  const subject = buildEmailSubject(body.result);

  try {
    await sendResultEmail(email, summary, subject);
    return Response.json({ ok: true });
  } catch (error) {
    if (error instanceof Error && error.message === "EMAIL_NOT_CONFIGURED") {
      return Response.json(
        { error: "이메일 발송 설정이 완료되지 않았습니다. 관리자에게 문의해주세요." },
        { status: 503 },
      );
    }

    return Response.json({ error: "이메일 발송에 실패했습니다. 잠시 후 다시 시도해주세요." }, { status: 502 });
  }
}
