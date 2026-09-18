import { NextResponse } from "next/server";
import { resetAdminPassword } from "@/lib/admin-store";
import { isDatabaseConfigured } from "@/lib/db";

export async function POST(request: Request) {
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ error: "데이터베이스가 설정되지 않았습니다." }, { status: 503 });
  }

  let body: { token?: string; password?: string };
  try {
    body = (await request.json()) as { token?: string; password?: string };
  } catch {
    return NextResponse.json({ error: "요청 형식이 올바르지 않습니다." }, { status: 400 });
  }

  const token = body.token?.trim();
  const password = body.password;

  if (!token || !password || password.length < 8) {
    return NextResponse.json({ error: "8자 이상 비밀번호를 입력해 주세요." }, { status: 400 });
  }

  try {
    const success = await resetAdminPassword(token, password);
    if (!success) {
      return NextResponse.json({ error: "유효하지 않거나 만료된 링크입니다. 다시 요청해 주세요." }, { status: 400 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "비밀번호 재설정 중 오류가 발생했습니다." }, { status: 500 });
  }
}
