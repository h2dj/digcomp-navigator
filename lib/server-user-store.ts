import { ensureSchema, getSql, isDatabaseConfigured } from "@/lib/db";
import { digcompAreas, type DigcompAreaId } from "@/data/digcomp";
import { normalizeOrganizationType, normalizeProfileRole, profileOrganizationOptions, profileRoleOptions } from "@/lib/profile-options";
import type { AggregateStats, DistributionItem, SegmentStat } from "@/lib/public-stats";
import type { AssessmentResult, Profile } from "@/lib/scoring";

export type { AggregateStats };

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

function emptyAreaAverages(): Record<DigcompAreaId, number | null> {
  return Object.fromEntries(digcompAreas.map((area) => [area.id, null])) as Record<DigcompAreaId, number | null>;
}

function roundScore(value: number): number {
  return Math.round(value * 10) / 10;
}

function emptyAggregateStats(): AggregateStats {
  return {
    totalParticipants: 0,
    completedAssessments: 0,
    averageScore: null,
    medianScore: null,
    areaAverages: emptyAreaAverages(),
    roleDistribution: [],
    organizationDistribution: [],
    roleSegmentStats: buildSegmentStats(profileRoleOptions, [], normalizeProfileRole),
    organizationSegmentStats: buildSegmentStats(profileOrganizationOptions, [], normalizeOrganizationType),
  };
}

function mergeDistributionRows(
  rows: ReadonlyArray<Record<string, unknown>>,
  normalizeName: (value: string | null | undefined) => string,
): DistributionItem[] {
  const counts = new Map<string, number>();

  for (const row of rows) {
    const name = normalizeName(typeof row.name === "string" ? row.name : null);
    const value = Number(row.value ?? 0);
    if (value <= 0) continue;
    counts.set(name, (counts.get(name) ?? 0) + value);
  }

  return [...counts.entries()]
    .map(([name, value]) => ({ name, value }))
    .sort((left, right) => right.value - left.value || left.name.localeCompare(right.name, "ko"));
}

type SegmentAccumulator = {
  participantCount: number;
  resultCount: number;
  totalScore: number;
};

function mergeSegmentRows(
  rows: ReadonlyArray<Record<string, unknown>>,
  normalizeName: (value: string | null | undefined) => string,
): Map<string, SegmentAccumulator> {
  const segments = new Map<string, SegmentAccumulator>();

  for (const row of rows) {
    const name = normalizeName(typeof row.name === "string" ? row.name : null);
    const participantCount = Number(row.participant_count ?? 0);
    const resultCount = Number(row.result_count ?? 0);
    const averageScore = Number(row.average_score ?? 0);

    if (participantCount <= 0 || resultCount <= 0) continue;

    const existing = segments.get(name);
    if (!existing) {
      segments.set(name, {
        participantCount,
        resultCount,
        totalScore: averageScore * resultCount,
      });
      continue;
    }

    existing.participantCount += participantCount;
    existing.resultCount += resultCount;
    existing.totalScore += averageScore * resultCount;
  }

  return segments;
}

function buildSegmentStats(
  knownOptions: readonly string[],
  rows: ReadonlyArray<Record<string, unknown>>,
  normalizeName: (value: string | null | undefined) => string,
): SegmentStat[] {
  const merged = mergeSegmentRows(rows, normalizeName);
  const stats: SegmentStat[] = [];

  for (const name of knownOptions) {
    const segment = merged.get(name);
    stats.push({
      name,
      participantCount: segment?.participantCount ?? 0,
      averageScore: segment ? roundScore(segment.totalScore / segment.resultCount) : 0,
    });
    merged.delete(name);
  }

  const extras = [...merged.entries()]
    .map(([name, segment]) => ({
      name,
      participantCount: segment.participantCount,
      averageScore: roundScore(segment.totalScore / segment.resultCount),
    }))
    .sort((left, right) => right.participantCount - left.participantCount || left.name.localeCompare(right.name, "ko"));

  return [...stats, ...extras];
}

export async function getAggregateStats(): Promise<AggregateStats> {
  if (!isDatabaseConfigured()) {
    return emptyAggregateStats();
  }

  await ensureSchema();
  const sql = getSql();
  if (!sql) {
    return emptyAggregateStats();
  }

  const [summaryRows, areaRows, roleRows, organizationRows, roleSegmentRows, organizationSegmentRows] =
    await Promise.all([
    sql`
      SELECT
        COUNT(*)::int AS completed_assessments,
        COUNT(DISTINCT user_id)::int AS total_participants,
        AVG((result->>'overallScore')::double precision) AS average_score,
        PERCENTILE_CONT(0.5) WITHIN GROUP (
          ORDER BY (result->>'overallScore')::double precision
        ) AS median_score
      FROM assessment_results
    `,
    sql`
      SELECT
        area->>'areaId' AS area_id,
        AVG((area->>'score')::double precision) AS average_score
      FROM assessment_results,
      LATERAL jsonb_array_elements(result->'areaScores') AS area
      GROUP BY area->>'areaId'
    `,
    sql`
      SELECT
        u.profile->>'role' AS name,
        COUNT(DISTINCT u.id)::int AS value
      FROM users u
      INNER JOIN assessment_results r ON r.user_id = u.id
      GROUP BY u.profile->>'role'
    `,
    sql`
      SELECT
        u.profile->>'organizationType' AS name,
        COUNT(DISTINCT u.id)::int AS value
      FROM users u
      INNER JOIN assessment_results r ON r.user_id = u.id
      GROUP BY u.profile->>'organizationType'
    `,
    sql`
      SELECT
        u.profile->>'role' AS name,
        COUNT(DISTINCT u.id)::int AS participant_count,
        COUNT(r.id)::int AS result_count,
        AVG((r.result->>'overallScore')::double precision) AS average_score
      FROM users u
      INNER JOIN assessment_results r ON r.user_id = u.id
      GROUP BY u.profile->>'role'
    `,
    sql`
      SELECT
        u.profile->>'organizationType' AS name,
        COUNT(DISTINCT u.id)::int AS participant_count,
        COUNT(r.id)::int AS result_count,
        AVG((r.result->>'overallScore')::double precision) AS average_score
      FROM users u
      INNER JOIN assessment_results r ON r.user_id = u.id
      GROUP BY u.profile->>'organizationType'
    `,
  ]);

  const summary = summaryRows[0];
  const completedAssessments = Number(summary?.completed_assessments ?? 0);

  const areaAverages = emptyAreaAverages();
  for (const row of areaRows) {
    const areaId = row.area_id as DigcompAreaId | null;
    if (!areaId || !(areaId in areaAverages)) continue;
    areaAverages[areaId] = roundScore(Number(row.average_score));
  }

  const averageScoreRaw = summary?.average_score;
  const medianScoreRaw = summary?.median_score;

  return {
    totalParticipants: Number(summary?.total_participants ?? 0),
    completedAssessments,
    averageScore:
      completedAssessments > 0 && averageScoreRaw != null ? roundScore(Number(averageScoreRaw)) : null,
    medianScore: completedAssessments > 0 && medianScoreRaw != null ? roundScore(Number(medianScoreRaw)) : null,
    areaAverages,
    roleDistribution: mergeDistributionRows(roleRows, normalizeProfileRole),
    organizationDistribution: mergeDistributionRows(organizationRows, normalizeOrganizationType),
    roleSegmentStats: buildSegmentStats(profileRoleOptions, roleSegmentRows, normalizeProfileRole),
    organizationSegmentStats: buildSegmentStats(
      profileOrganizationOptions,
      organizationSegmentRows,
      normalizeOrganizationType,
    ),
  };
}

/** @deprecated getAggregateStats 사용 */
export async function getAggregateCounts(): Promise<Pick<AggregateStats, "totalParticipants" | "completedAssessments">> {
  const stats = await getAggregateStats();
  return {
    totalParticipants: stats.totalParticipants,
    completedAssessments: stats.completedAssessments,
  };
}

export type UserSummary = {
  userId: string;
  email: string | null;
  profile: Profile;
  resultCount: number;
  latestResultAt: string | null;
  updatedAt: string;
};

export type ListUsersFilters = {
  role?: string;
  organizationType?: string;
};

export async function listUsers(
  limit = 100,
  offset = 0,
  filters: ListUsersFilters = {},
): Promise<UserSummary[]> {
  if (!isDatabaseConfigured()) return [];

  await ensureSchema();
  const sql = getSql();
  if (!sql) return [];

  const roleFilter = filters.role?.trim() || null;
  const organizationTypeFilter = filters.organizationType?.trim() || null;

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
    WHERE (${roleFilter}::text IS NULL OR u.profile->>'role' = ${roleFilter})
      AND (${organizationTypeFilter}::text IS NULL OR u.profile->>'organizationType' = ${organizationTypeFilter})
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
