import { NextResponse } from "next/server";
import { getGuideLinksConfig } from "@/lib/guide-config";

export async function GET() {
  try {
    const config = await getGuideLinksConfig();
    return NextResponse.json(config);
  } catch {
    return NextResponse.json({ error: "개발 가이드 설정을 불러오지 못했습니다." }, { status: 500 });
  }
}
