import { NextResponse } from "next/server";
import { createAdminAccount, deleteAdminAccount, listAdminAccounts } from "@/lib/admin-store";
import { isDatabaseConfigured } from "@/lib/db";

export async function GET() {
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ error: "데이터베이스가 설정되지 않았습니다." }, { status: 503 });
  }

  try {
    const accounts = await listAdminAccounts();
    return NextResponse.json({ accounts });
  } catch {
    return NextResponse.json({ error: "관리자 계정 목록을 불러오지 못했습니다." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ error: "데이터베이스가 설정되지 않았습니다." }, { status: 503 });
  }

  try {
    const body = (await request.json()) as { email?: string; password?: string; adminGroup?: string };
    const email = body.email?.trim();
    const password = body.password;
    const adminGroup = body.adminGroup?.trim() || "admin";

    if (!email || !password || password.length < 8) {
      return NextResponse.json({ error: "이메일과 8자 이상 비밀번호가 필요합니다." }, { status: 400 });
    }

    const account = await createAdminAccount({ email, password, adminGroup });
    return NextResponse.json({ account });
  } catch (error) {
    const message = error instanceof Error && error.message.includes("unique") ? "이미 등록된 이메일입니다." : "관리자 계정 생성 중 오류가 발생했습니다.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ error: "데이터베이스가 설정되지 않았습니다." }, { status: 503 });
  }

  try {
    const body = (await request.json()) as { adminId?: string };
    const adminId = body.adminId?.trim();
    if (!adminId) {
      return NextResponse.json({ error: "adminId가 필요합니다." }, { status: 400 });
    }

    const deleted = await deleteAdminAccount(adminId);
    if (!deleted) {
      return NextResponse.json({ error: "관리자 계정을 찾을 수 없습니다." }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "관리자 계정 삭제 중 오류가 발생했습니다." }, { status: 500 });
  }
}
