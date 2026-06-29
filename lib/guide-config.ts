import { digcompAreas, type DigcompAreaId } from "@/data/digcomp";
import { ensureSchema, getSql, isDatabaseConfigured } from "@/lib/db";
import {
  getDefaultGuideLinksConfig,
  type GuideLink,
  type GuideLinksConfig,
} from "@/lib/guide-defaults";

const GUIDE_CONFIG_ID = "guide-links";

function normalizeLink(link: GuideLink): GuideLink | null {
  const title = String(link.title ?? "").trim();
  const href = String(link.href ?? "").trim();
  const description = String(link.description ?? "").trim();

  if (!title || !href || !description) return null;

  return { title, href, description };
}

export function validateGuideLinksConfig(input: GuideLinksConfig): GuideLinksConfig {
  const defaults = getDefaultGuideLinksConfig();
  const linksByArea = {} as Record<DigcompAreaId, GuideLink[]>;

  for (const area of digcompAreas) {
    const rawLinks = input.linksByArea?.[area.id] ?? defaults.linksByArea[area.id];
    const normalized = rawLinks
      .map((link) => normalizeLink(link))
      .filter((link): link is GuideLink => link !== null);

    if (normalized.length === 0) {
      throw new Error(`${area.title} 영역에 추천 링크가 최소 1개 필요합니다.`);
    }

    linksByArea[area.id] = normalized;
  }

  return {
    linksByArea,
    updatedAt: new Date().toISOString(),
  };
}

export async function getGuideLinksConfig(): Promise<GuideLinksConfig> {
  const defaults = getDefaultGuideLinksConfig();
  if (!isDatabaseConfigured()) return defaults;

  await ensureSchema();
  const sql = getSql();
  if (!sql) return defaults;

  const rows = await sql`
    SELECT config, updated_at
    FROM assessment_config
    WHERE id = ${GUIDE_CONFIG_ID}
    LIMIT 1
  `;

  if (rows.length === 0) return defaults;

  const stored = rows[0].config as GuideLinksConfig;
  const updatedAt = rows[0].updated_at ? new Date(rows[0].updated_at as string).toISOString() : undefined;

  try {
    const validated = validateGuideLinksConfig({
      linksByArea: stored.linksByArea ?? defaults.linksByArea,
    });
    return { ...validated, updatedAt };
  } catch {
    return defaults;
  }
}

export async function saveGuideLinksConfig(input: GuideLinksConfig): Promise<GuideLinksConfig> {
  if (!isDatabaseConfigured()) {
    throw new Error("DATABASE_URL is not configured");
  }

  const config = validateGuideLinksConfig(input);

  await ensureSchema();
  const sql = getSql();
  if (!sql) {
    throw new Error("DATABASE_URL is not configured");
  }

  await sql`
    INSERT INTO assessment_config (id, config, updated_at)
    VALUES (${GUIDE_CONFIG_ID}, ${config as unknown as Record<string, unknown>}, NOW())
    ON CONFLICT (id) DO UPDATE
    SET config = EXCLUDED.config, updated_at = NOW()
  `;

  return config;
}
