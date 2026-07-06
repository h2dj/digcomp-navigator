import { NextResponse } from "next/server";
import { getAggregateStats } from "@/lib/server-user-store";

export async function GET() {
  try {
    const stats = await getAggregateStats();
    return NextResponse.json(stats);
  } catch {
    return NextResponse.json({ error: "통계를 불러오지 못했습니다." }, { status: 500 });
  }
}
