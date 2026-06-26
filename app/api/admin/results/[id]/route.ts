import { NextResponse } from "next/server";
import { deleteAssessmentResult } from "@/lib/server-user-store";
import { isDatabaseConfigured } from "@/lib/db";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function DELETE(_request: Request, context: RouteContext) {
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ error: "데이터베이스가 설정되지 않았습니다." }, { status: 503 });
  }

  try {
    const { id } = await context.params;
    const deleted = await deleteAssessmentResult(id);
    if (!deleted) {
      return NextResponse.json({ error: "진단 결과를 찾을 수 없습니다." }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "진단 결과 삭제 중 오류가 발생했습니다." }, { status: 500 });
  }
}
