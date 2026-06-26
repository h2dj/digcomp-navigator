import { NextResponse } from "next/server";
import { getAssessmentConfig, saveAssessmentConfig } from "@/lib/assessment-config";
import type { AssessmentConfig } from "@/lib/assessment-defaults";
import { isDatabaseConfigured } from "@/lib/db";

export async function GET() {
  try {
    const config = await getAssessmentConfig();
    return NextResponse.json(config);
  } catch {
    return NextResponse.json({ error: "진단 설정을 불러오지 못했습니다." }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ error: "데이터베이스가 설정되지 않았습니다." }, { status: 503 });
  }

  try {
    const body = (await request.json()) as AssessmentConfig;
    const config = await saveAssessmentConfig(body);
    return NextResponse.json(config);
  } catch (error) {
    const message = error instanceof Error ? error.message : "진단 설정 저장 중 오류가 발생했습니다.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
