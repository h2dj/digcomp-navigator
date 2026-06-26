import { NextResponse } from "next/server";
import { getAdminSessionFromCookies } from "@/lib/auth";

export async function GET() {
  const session = await getAdminSessionFromCookies();
  if (!session) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  return NextResponse.json({
    authenticated: true,
    admin: {
      email: session.email,
      adminGroup: session.adminGroup,
    },
  });
}
