import { ensureSchema, getSql, isDatabaseConfigured } from "@/lib/db";
import {
  getDefaultAssessmentConfig,
  getDefaultDeepAssessmentConfig,
  type AssessmentConfig,
  type AssessmentQuestionConfig,
  type ResponseScaleItem,
} from "@/lib/assessment-defaults";
import type { ProficiencyLevel } from "@/lib/scoring";
import { isProficiencyLevel } from "@/data/deep-assessment";

const BASIC_CONFIG_ID = "default";

function getDeepConfigId(level: ProficiencyLevel): string {
  return `deep-${level}`;
}

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

function validateAgainstDefaults(input: AssessmentConfig, defaults: AssessmentConfig): AssessmentConfig {
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

export function validateAssessmentConfig(input: AssessmentConfig): AssessmentConfig {
  return validateAgainstDefaults(input, getDefaultAssessmentConfig());
}

export function validateDeepAssessmentConfig(level: ProficiencyLevel, input: AssessmentConfig): AssessmentConfig {
  return validateAgainstDefaults(input, getDefaultDeepAssessmentConfig(level));
}

async function loadConfigById(configId: string, defaults: AssessmentConfig): Promise<AssessmentConfig> {
  if (!isDatabaseConfigured()) return defaults;

  await ensureSchema();
  const sql = getSql();
  if (!sql) return defaults;

  const rows = await sql`
    SELECT config, updated_at
    FROM assessment_config
    WHERE id = ${configId}
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

async function saveConfigById(configId: string, config: AssessmentConfig): Promise<AssessmentConfig> {
  if (!isDatabaseConfigured()) {
    throw new Error("DATABASE_URL is not configured");
  }

  await ensureSchema();
  const sql = getSql();
  if (!sql) {
    throw new Error("DATABASE_URL is not configured");
  }

  await sql`
    INSERT INTO assessment_config (id, config, updated_at)
    VALUES (${configId}, ${config as unknown as Record<string, unknown>}, NOW())
    ON CONFLICT (id) DO UPDATE
    SET config = EXCLUDED.config, updated_at = NOW()
  `;

  return config;
}

export async function getAssessmentConfig(): Promise<AssessmentConfig> {
  return loadConfigById(BASIC_CONFIG_ID, getDefaultAssessmentConfig());
}

export async function saveAssessmentConfig(input: AssessmentConfig): Promise<AssessmentConfig> {
  const config = validateAssessmentConfig(input);
  return saveConfigById(BASIC_CONFIG_ID, config);
}

export async function getDeepAssessmentConfig(level: ProficiencyLevel): Promise<AssessmentConfig> {
  return loadConfigById(getDeepConfigId(level), getDefaultDeepAssessmentConfig(level));
}

export async function saveDeepAssessmentConfig(
  level: ProficiencyLevel,
  input: AssessmentConfig,
): Promise<AssessmentConfig> {
  const config = validateDeepAssessmentConfig(level, input);
  return saveConfigById(getDeepConfigId(level), config);
}

export function parseDeepConfigLevel(value: string): ProficiencyLevel | null {
  return isProficiencyLevel(value) ? value : null;
}
