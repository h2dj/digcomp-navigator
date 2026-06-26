import { ensureSchema, getSql, isDatabaseConfigured } from "@/lib/db";
import type { AssessmentResult, Profile } from "@/lib/scoring";

export type StoredUserData = {
  userId: string;
  profile: Profile;
  results: AssessmentResult[];
};

export async function loadUserData(userId: string): Promise<StoredUserData | null> {
  if (!isDatabaseConfigured()) return null;

  await ensureSchema();
  const sql = getSql();
  if (!sql) return null;

  const users = await sql`
    SELECT id, profile
    FROM users
    WHERE id = ${userId}
    LIMIT 1
  `;

  if (users.length === 0) return null;

  const results = await sql`
    SELECT result
    FROM assessment_results
    WHERE user_id = ${userId}
    ORDER BY created_at DESC
    LIMIT 20
  `;

  return {
    userId,
    profile: users[0].profile as Profile,
    results: results.map((row) => row.result as AssessmentResult),
  };
}

export async function loadUserDataByEmail(email: string): Promise<StoredUserData | null> {
  if (!isDatabaseConfigured()) return null;

  await ensureSchema();
  const sql = getSql();
  if (!sql) return null;

  const normalizedEmail = email.trim().toLowerCase();
  const users = await sql`
    SELECT id, profile
    FROM users
    WHERE LOWER(email) = ${normalizedEmail}
    LIMIT 1
  `;

  if (users.length === 0) return null;

  const userId = users[0].id as string;
  const results = await sql`
    SELECT result
    FROM assessment_results
    WHERE user_id = ${userId}
    ORDER BY created_at DESC
    LIMIT 20
  `;

  return {
    userId,
    profile: users[0].profile as Profile,
    results: results.map((row) => row.result as AssessmentResult),
  };
}

export async function saveUserProfile(userId: string, profile: Profile): Promise<void> {
  if (!isDatabaseConfigured()) return;

  await ensureSchema();
  const sql = getSql();
  if (!sql) return;

  const email = profile.email?.trim() || null;

  await sql`
    INSERT INTO users (id, email, profile, updated_at)
    VALUES (${userId}, ${email}, ${profile as unknown as Record<string, unknown>}, NOW())
    ON CONFLICT (id) DO UPDATE
    SET
      email = EXCLUDED.email,
      profile = EXCLUDED.profile,
      updated_at = NOW()
  `;
}

export async function saveUserResult(userId: string, result: AssessmentResult): Promise<void> {
  if (!isDatabaseConfigured()) return;

  await ensureSchema();
  const sql = getSql();
  if (!sql) return;

  await sql`
    INSERT INTO users (id, profile, updated_at)
    VALUES (${userId}, '{}'::jsonb, NOW())
    ON CONFLICT (id) DO NOTHING
  `;

  await sql`
    INSERT INTO assessment_results (id, user_id, result, created_at)
    VALUES (${result.id}, ${userId}, ${result as unknown as Record<string, unknown>}, ${result.createdAt})
    ON CONFLICT (id) DO UPDATE
    SET result = EXCLUDED.result
  `;
}

export async function syncUserData(
  userId: string,
  profile: Profile | undefined,
  results: AssessmentResult[] | undefined,
): Promise<void> {
  if (profile) {
    await saveUserProfile(userId, profile);
  }

  if (results?.length) {
    for (const result of results) {
      await saveUserResult(userId, result);
    }
  }
}

export type UserSummary = {
  userId: string;
  email: string | null;
  profile: Profile;
  resultCount: number;
  latestResultAt: string | null;
  updatedAt: string;
};

export async function listUsers(limit = 100, offset = 0): Promise<UserSummary[]> {
  if (!isDatabaseConfigured()) return [];

  await ensureSchema();
  const sql = getSql();
  if (!sql) return [];

  const rows = await sql`
    SELECT
      u.id,
      u.email,
      u.profile,
      u.updated_at,
      COUNT(r.id)::int AS result_count,
      MAX(r.created_at) AS latest_result_at
    FROM users u
    LEFT JOIN assessment_results r ON r.user_id = u.id
    GROUP BY u.id, u.email, u.profile, u.updated_at
    ORDER BY u.updated_at DESC
    LIMIT ${limit}
    OFFSET ${offset}
  `;

  return rows.map((row) => ({
    userId: row.id as string,
    email: (row.email as string | null) ?? null,
    profile: row.profile as Profile,
    resultCount: Number(row.result_count ?? 0),
    latestResultAt: row.latest_result_at ? new Date(row.latest_result_at as string).toISOString() : null,
    updatedAt: new Date(row.updated_at as string).toISOString(),
  }));
}

export async function deleteUser(userId: string): Promise<boolean> {
  if (!isDatabaseConfigured()) return false;

  await ensureSchema();
  const sql = getSql();
  if (!sql) return false;

  const rows = await sql`
    DELETE FROM users
    WHERE id = ${userId}
    RETURNING id
  `;

  return rows.length > 0;
}

export async function deleteAssessmentResult(resultId: string): Promise<boolean> {
  if (!isDatabaseConfigured()) return false;

  await ensureSchema();
  const sql = getSql();
  if (!sql) return false;

  const rows = await sql`
    DELETE FROM assessment_results
    WHERE id = ${resultId}
    RETURNING id
  `;

  return rows.length > 0;
}
