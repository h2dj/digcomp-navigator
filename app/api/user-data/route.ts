import { isValidEmail } from "@/lib/email";
import { loadUserData, loadUserDataByEmail, syncUserData } from "@/lib/server-user-store";
import type { AssessmentResult, Profile } from "@/lib/scoring";

type PostBody = {
  userId?: string;
  profile?: Profile;
  results?: AssessmentResult[];
  result?: AssessmentResult;
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId")?.trim();
  const email = searchParams.get("email")?.trim();

  if (!userId && !email) {
    return Response.json({ error: "userId 또는 email이 필요합니다." }, { status: 400 });
  }

  if (!process.env.DATABASE_URL) {
    return Response.json({ error: "서버 저장소가 설정되지 않았습니다." }, { status: 503 });
  }

  try {
    const data = email && isValidEmail(email) ? await loadUserDataByEmail(email) : userId ? await loadUserData(userId) : null;

    if (!data) {
      return Response.json({ profile: null, results: [], userId: userId ?? null });
    }

    return Response.json(data);
  } catch {
    return Response.json({ error: "데이터를 불러오지 못했습니다." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!process.env.DATABASE_URL) {
    return Response.json({ error: "서버 저장소가 설정되지 않았습니다." }, { status: 503 });
  }

  let body: PostBody;

  try {
    body = (await request.json()) as PostBody;
  } catch {
    return Response.json({ error: "요청 형식이 올바르지 않습니다." }, { status: 400 });
  }

  const userId = body.userId?.trim();
  if (!userId) {
    return Response.json({ error: "userId가 필요합니다." }, { status: 400 });
  }

  const results = body.results ?? (body.result ? [body.result] : undefined);

  try {
    await syncUserData(userId, body.profile, results);
    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: "데이터를 저장하지 못했습니다." }, { status: 500 });
  }
}
