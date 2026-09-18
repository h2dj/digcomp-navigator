import { NextResponse } from "next/server";
import { deleteUser, listUsers, type ListUsersSort } from "@/lib/server-user-store";
import { isDatabaseConfigured } from "@/lib/db";
import { isProficiencyLevel } from "@/lib/scoring";

const sortValues: ListUsersSort[] = ["updatedAt", "email", "resultCount", "latestResultAt"];

function parseSort(value: string | null): ListUsersSort | undefined {
  return sortValues.find((sort) => sort === value);
}

export async function GET(request: Request) {
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ error: "데이터베이스가 설정되지 않았습니다." }, { status: 503 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const limit = Math.min(Number.parseInt(searchParams.get("limit") ?? "20", 10) || 20, 100);
    const offset = Math.max(Number.parseInt(searchParams.get("offset") ?? "0", 10) || 0, 0);
    const role = searchParams.get("role")?.trim() || undefined;
    const organizationType = searchParams.get("organizationType")?.trim() || undefined;
    const emailQuery = searchParams.get("email")?.trim() || undefined;
    const digitalTypeId = searchParams.get("digitalTypeId")?.trim() || undefined;
    const levelParam = searchParams.get("level")?.trim() || "";
    const level = isProficiencyLevel(levelParam) ? levelParam : undefined;
    const hasResults = searchParams.get("hasResults") === "true";
    const sort = parseSort(searchParams.get("sort"));

    const result = await listUsers(limit, offset, {
      role,
      organizationType,
      emailQuery,
      digitalTypeId,
      level,
      hasResults,
      sort,
    });
    return NextResponse.json(result);
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
