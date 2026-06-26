import { NextResponse } from "next/server";
import { getAssessmentConfig } from "@/lib/assessment-config";

export async function GET() {
  try {
    const config = await getAssessmentConfig();
    return NextResponse.json(config);
  } catch {
    return NextResponse.json({ error: "진단 설정을 불러오지 못했습니다." }, { status: 500 });
  }
}
