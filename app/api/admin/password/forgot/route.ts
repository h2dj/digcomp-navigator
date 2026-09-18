import { NextResponse } from "next/server";
import { createPasswordResetToken } from "@/lib/admin-store";
import { isDatabaseConfigured } from "@/lib/db";
import { isValidEmail, sendAdminPasswordResetEmail } from "@/lib/email";
import { getSiteUrl } from "@/lib/result-share";

const GENERIC_MESSAGE = "입력하신 이메일로 등록된 계정이 있다면 비밀번호 재설정 링크를 보내드렸습니다.";

export async function POST(request: Request) {
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ error: "데이터베이스가 설정되지 않았습니다." }, { status: 503 });
  }

  let body: { email?: string };
  try {
    body = (await request.json()) as { email?: string };
  } catch {
    return NextResponse.json({ error: "요청 형식이 올바르지 않습니다." }, { status: 400 });
  }

  const email = body.email?.trim() ?? "";
  if (!isValidEmail(email)) {
    return NextResponse.json({ error: "올바른 이메일 주소를 입력해주세요." }, { status: 400 });
  }

  try {
    const result = await createPasswordResetToken(email);
    if (result) {
      const resetUrl = `${getSiteUrl()}/admin/reset-password?token=${result.token}`;
      await sendAdminPasswordResetEmail(result.admin.email, resetUrl);
    }

    // 계정 존재 여부와 무관하게 동일한 응답을 반환해 이메일 등록 여부가 노출되지 않도록 한다.
    return NextResponse.json({ ok: true, message: GENERIC_MESSAGE });
  } catch (error) {
    if (error instanceof Error && error.message === "EMAIL_NOT_CONFIGURED") {
      return NextResponse.json(
        { error: "이메일 발송 설정이 완료되지 않았습니다. 관리자에게 문의해주세요." },
        { status: 503 },
      );
    }

    return NextResponse.json({ error: "요청 처리 중 오류가 발생했습니다." }, { status: 500 });
  }
}
