import { isValidEmail } from "@/lib/email";
import { saveAcademyInterest } from "@/lib/academy-interests";
import { isAcademyInterestId, type AcademyInterestId } from "@/data/academy-interests";

type InterestRequestBody = {
  email?: string;
  interests?: string[];
  note?: string;
  source?: string;
};

export async function POST(request: Request) {
  let body: InterestRequestBody;

  try {
    body = (await request.json()) as InterestRequestBody;
  } catch {
    return Response.json({ error: "요청 형식이 올바르지 않습니다." }, { status: 400 });
  }

  const email = body.email?.trim() ?? "";
  if (!isValidEmail(email)) {
    return Response.json({ error: "올바른 이메일 주소를 입력해주세요." }, { status: 400 });
  }

  const interests: AcademyInterestId[] = Array.isArray(body.interests)
    ? body.interests.filter(isAcademyInterestId)
    : [];
  if (interests.length === 0) {
    return Response.json({ error: "관심 분야를 1개 이상 선택해주세요." }, { status: 400 });
  }

  const note = typeof body.note === "string" ? body.note.trim().slice(0, 500) : "";
  const source = typeof body.source === "string" ? body.source.trim().slice(0, 50) : "";

  try {
    await saveAcademyInterest({
      email,
      interests,
      note: note || undefined,
      source: source || undefined,
    });
    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: "등록 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요." }, { status: 500 });
  }
}
