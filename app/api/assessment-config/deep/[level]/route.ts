import { NextResponse } from "next/server";
import { getDeepAssessmentConfig, parseDeepConfigLevel } from "@/lib/assessment-config";

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
