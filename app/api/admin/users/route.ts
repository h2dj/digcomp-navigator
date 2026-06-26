import { NextResponse } from "next/server";
import { deleteUser, listUsers } from "@/lib/server-user-store";
import { isDatabaseConfigured } from "@/lib/db";

export async function GET(request: Request) {
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ error: "데이터베이스가 설정되지 않았습니다." }, { status: 503 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const limit = Math.min(Number.parseInt(searchParams.get("limit") ?? "100", 10) || 100, 200);
    const offset = Math.max(Number.parseInt(searchParams.get("offset") ?? "0", 10) || 0, 0);
    const users = await listUsers(limit, offset);
    return NextResponse.json({ users });
  } catch {
    return NextResponse.json({ error: "이용자 목록을 불러오지 못했습니다." }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ error: "데이터베이스가 설정되지 않았습니다." }, { status: 503 });
  }

  try {
    const body = (await request.json()) as { userId?: string };
    const userId = body.userId?.trim();
    if (!userId) {
      return NextResponse.json({ error: "userId가 필요합니다." }, { status: 400 });
    }

    const deleted = await deleteUser(userId);
    if (!deleted) {
      return NextResponse.json({ error: "이용자를 찾을 수 없습니다." }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "이용자 삭제 중 오류가 발생했습니다." }, { status: 500 });
  }
}
