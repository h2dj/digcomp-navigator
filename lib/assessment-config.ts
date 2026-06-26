import { ensureSchema, getSql, isDatabaseConfigured } from "@/lib/db";
import {
  getDefaultAssessmentConfig,
  type AssessmentConfig,
  type AssessmentQuestionConfig,
  type ResponseScaleItem,
} from "@/lib/assessment-defaults";

const CONFIG_ID = "default";

function normalizeResponseScale(scale: ResponseScaleItem[]): ResponseScaleItem[] {
  return scale
    .map((item) => ({
      value: Number(item.value),
      label: String(item.label ?? "").trim(),
      helper: String(item.helper ?? "").trim(),
    }))
    .filter((item) => item.value >= 1 && item.value <= 5 && item.label.length > 0)
    .sort((a, b) => a.value - b.value);
}

function normalizeQuestions(questions: AssessmentQuestionConfig[]): AssessmentQuestionConfig[] {
  return questions
    .map((question) => ({
      id: String(question.id).trim(),
      competencyId: String(question.competencyId).trim(),
      promptIndex: Number(question.promptIndex) || 0,
      areaId: String(question.areaId).trim(),
      areaTitle: String(question.areaTitle).trim(),
      categoryLabel: String(question.categoryLabel).trim(),
      prompt: String(question.prompt).trim(),
    }))
    .filter((question) => question.id && question.prompt);
}

export function validateAssessmentConfig(input: AssessmentConfig): AssessmentConfig {
  const defaults = getDefaultAssessmentConfig();
  const responseScale = normalizeResponseScale(input.responseScale);
  const questions = normalizeQuestions(input.questions);

  if (responseScale.length !== 5) {
    throw new Error("응답 척도는 1~5점 라벨이 모두 필요합니다.");
  }

  if (questions.length === 0) {
    throw new Error("진단 문항이 최소 1개 이상 필요합니다.");
  }

  const defaultIds = new Set(defaults.questions.map((question) => question.id));
  for (const question of questions) {
    if (!defaultIds.has(question.id)) {
      throw new Error(`알 수 없는 문항 ID입니다: ${question.id}`);
    }
  }

  return {
    responseScale,
    questions,
    updatedAt: new Date().toISOString(),
  };
}

export async function getAssessmentConfig(): Promise<AssessmentConfig> {
  const defaults = getDefaultAssessmentConfig();
  if (!isDatabaseConfigured()) return defaults;

  await ensureSchema();
  const sql = getSql();
  if (!sql) return defaults;

  const rows = await sql`
    SELECT config, updated_at
    FROM assessment_config
    WHERE id = ${CONFIG_ID}
    LIMIT 1
  `;

  if (rows.length === 0) return defaults;

  const stored = rows[0].config as AssessmentConfig;
  const updatedAt = rows[0].updated_at ? new Date(rows[0].updated_at as string).toISOString() : undefined;

  return {
    responseScale: normalizeResponseScale(stored.responseScale ?? defaults.responseScale),
    questions: normalizeQuestions(stored.questions ?? defaults.questions),
    updatedAt,
  };
}

export async function saveAssessmentConfig(input: AssessmentConfig): Promise<AssessmentConfig> {
  if (!isDatabaseConfigured()) {
    throw new Error("DATABASE_URL is not configured");
  }

  const config = validateAssessmentConfig(input);

  await ensureSchema();
  const sql = getSql();
  if (!sql) {
    throw new Error("DATABASE_URL is not configured");
  }

  await sql`
    INSERT INTO assessment_config (id, config, updated_at)
    VALUES (${CONFIG_ID}, ${config as unknown as Record<string, unknown>}, NOW())
    ON CONFLICT (id) DO UPDATE
    SET config = EXCLUDED.config, updated_at = NOW()
  `;

  return config;
}
