import { NextResponse } from "next/server";
import { getDeepAssessmentConfig, parseDeepConfigLevel, saveDeepAssessmentConfig } from "@/lib/assessment-config";
import type { AssessmentConfig } from "@/lib/assessment-defaults";
import { isDatabaseConfigured } from "@/lib/db";

type RouteContext = {
  params: Promise<{ level: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { level: levelParam } = await context.params;
    const level = parseDeepConfigLevel(decodeURIComponent(levelParam));
    if (!level) {
      return NextResponse.json({ error: "유효하지 않은 숙련도입니다." }, { status: 400 });
    }

    const config = await getDeepAssessmentConfig(level);
    return NextResponse.json(config);
  } catch {
    return NextResponse.json({ error: "심층 진단 설정을 불러오지 못했습니다." }, { status: 500 });
  }
}

export async function PUT(request: Request, context: RouteContext) {
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ error: "데이터베이스가 설정되지 않았습니다." }, { status: 503 });
  }

  try {
    const { level: levelParam } = await context.params;
    const level = parseDeepConfigLevel(decodeURIComponent(levelParam));
    if (!level) {
      return NextResponse.json({ error: "유효하지 않은 숙련도입니다." }, { status: 400 });
    }

    const body = (await request.json()) as AssessmentConfig;
    const config = await saveDeepAssessmentConfig(level, body);
    return NextResponse.json(config);
  } catch (error) {
    const message = error instanceof Error ? error.message : "심층 진단 설정 저장 중 오류가 발생했습니다.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
