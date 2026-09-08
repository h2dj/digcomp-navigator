import { ensureSchema, getSql, isDatabaseConfigured } from "@/lib/db";
import type { AcademyInterestId } from "@/data/academy-interests";

export type AcademyInterestSubmission = {
  email: string;
  interests: AcademyInterestId[];
  note?: string;
  source?: string;
};

/**
 * (가칭) 디지털 배움대학 관심 등록 폼 제출 내용을 저장한다.
 * DB가 설정되지 않은 환경(로컬 개발 등)에서는 저장 없이 조용히 넘어간다.
 */
export async function saveAcademyInterest(input: AcademyInterestSubmission): Promise<void> {
  if (!isDatabaseConfigured()) {
    console.warn("DATABASE_URL이 설정되지 않아 배움대학 관심 등록을 저장하지 않았습니다.");
    return;
  }

  await ensureSchema();
  const sql = getSql();
  if (!sql) return;

  await sql`
    INSERT INTO academy_interests (id, email, interests, note, source)
    VALUES (
      ${crypto.randomUUID()},
      ${input.email},
      ${input.interests as unknown as Record<string, unknown>},
      ${input.note ?? null},
      ${input.source ?? null}
    )
  `;
}
