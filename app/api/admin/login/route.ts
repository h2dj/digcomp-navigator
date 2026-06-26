import { NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  createSessionToken,
  getSessionCookieOptions,
  isAuthConfigured,
} from "@/lib/auth";
import { verifyAdminPassword } from "@/lib/admin-store";
import { isDatabaseConfigured } from "@/lib/db";

export async function POST(request: Request) {
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ error: "데이터베이스가 설정되지 않았습니다." }, { status: 503 });
  }

  if (!isAuthConfigured()) {
    return NextResponse.json({ error: "AUTH_SECRET이 설정되지 않았습니다." }, { status: 503 });
  }

  try {
    const body = (await request.json()) as { email?: string; password?: string };
    const email = body.email?.trim();
    const password = body.password;

    if (!email || !password) {
      return NextResponse.json({ error: "이메일과 비밀번호를 입력해 주세요." }, { status: 400 });
    }

    const admin = await verifyAdminPassword(email, password);
    if (!admin) {
      return NextResponse.json({ error: "이메일 또는 비밀번호가 올바르지 않습니다." }, { status: 401 });
    }

    const token = await createSessionToken({
      adminId: admin.id,
      email: admin.email,
      adminGroup: admin.adminGroup,
    });

    if (!token) {
      return NextResponse.json({ error: "세션을 생성할 수 없습니다." }, { status: 500 });
    }

    const response = NextResponse.json({
      ok: true,
      admin: {
        email: admin.email,
        adminGroup: admin.adminGroup,
      },
    });
    response.cookies.set(ADMIN_SESSION_COOKIE, token, getSessionCookieOptions());
    return response;
  } catch {
    return NextResponse.json({ error: "로그인 처리 중 오류가 발생했습니다." }, { status: 500 });
  }
}
