import { NextResponse } from "next/server";
import { getGuideLinksConfig, saveGuideLinksConfig } from "@/lib/guide-config";
import type { GuideLinksConfig } from "@/lib/guide-defaults";
import { isDatabaseConfigured } from "@/lib/db";

export async function GET() {
  try {
    const config = await getGuideLinksConfig();
    return NextResponse.json(config);
  } catch {
    return NextResponse.json({ error: "개발 가이드 설정을 불러오지 못했습니다." }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ error: "데이터베이스가 설정되지 않았습니다." }, { status: 503 });
  }

  try {
    const body = (await request.json()) as GuideLinksConfig;
    const config = await saveGuideLinksConfig(body);
    return NextResponse.json(config);
  } catch (error) {
    const message = error instanceof Error ? error.message : "개발 가이드 설정 저장 중 오류가 발생했습니다.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
