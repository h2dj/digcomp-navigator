import { allCompetencies, digcompAreas, type DigcompAreaId } from "@/data/digcomp";
import { canClassifyDigitalType, classifyDigitalType, type DigitalTypeResult } from "@/lib/digital-type-classifier";

export type AnswerMap = Record<string, number>;

export type AreaScore = {
  areaId: DigcompAreaId;
  title: string;
  score: number;
  average: number;
  percentile: number;
};

export type CompetencyScore = {
  competencyId: string;
  areaId: DigcompAreaId;
  title: string;
  score: number;
};

export type ProficiencyLevel = "초급" | "중급" | "상급" | "최상급";

export const proficiencyLevels: ProficiencyLevel[] = ["초급", "중급", "상급", "최상급"];

export const legacyProficiencyLevelMap: Record<string, ProficiencyLevel> = {
  기초: "초급",
  고급: "상급",
  전문가: "최상급",
};

export function normalizeProficiencyLevel(value: string | null | undefined): ProficiencyLevel | null {
  if (!value) return null;
  if (proficiencyLevels.includes(value as ProficiencyLevel)) {
    return value as ProficiencyLevel;
  }
  return legacyProficiencyLevelMap[value] ?? null;
}

export function isProficiencyLevel(value: string): value is ProficiencyLevel {
  return normalizeProficiencyLevel(value) !== null;
}

export function parseProficiencyLevel(value: string): ProficiencyLevel | null {
  return normalizeProficiencyLevel(value);
}

export function getLegacyProficiencyLevel(level: ProficiencyLevel): string | null {
  const entry = Object.entries(legacyProficiencyLevelMap).find(([, current]) => current === level);
  return entry?.[0] ?? null;
}

export type AssessmentType = "basic" | "deep";

export type AssessmentResult = {
  id: string;
  createdAt: string;
  assessmentType?: AssessmentType;
  deepLevel?: ProficiencyLevel;
  areaScores: AreaScore[];
  competencyScores: CompetencyScore[];
  overallScore: number;
  level: ProficiencyLevel;
  strengths: CompetencyScore[];
  growthAreas: CompetencyScore[];
  digitalType?: DigitalTypeResult;
};

export type Profile = {
  role: string;
  organizationType: string;
  years: string;
  emailOptIn: boolean;
  email?: string;
};

export const defaultProfile: Profile = {
  role: "실무 직원",
  organizationType: "시민사회단체",
  years: "1-3년",
  emailOptIn: false,
};

export const storageKeys = {
  userId: "digcomp-navigator:user-id",
  latestResult: "digcomp-navigator:latest-result",
  history: "digcomp-navigator:history",
  profile: "digcomp-navigator:profile",
  draftAnswers: "digcomp-navigator:draft-answers",
  draftQuestionIndex: "digcomp-navigator:draft-question-index",
};

export const cohortAverages: Record<DigcompAreaId, number> = {
  "information-data": 2.35,
  "communication-collaboration": 2.52,
  "content-creation": 2.08,
  safety: 1.94,
  "problem-solving": 2.16,
};

export function getLevel(score: number): ProficiencyLevel {
  if (score >= 3.4) return "최상급";
  if (score >= 2.5) return "상급";
  if (score >= 1.5) return "중급";
  return "초급";
}

export function scoreToPercentile(score: number): number {
  const normalized = Math.max(0, Math.min(4, score));
  return Math.round(12 + normalized * 20.5);
}

export function formatScore(score: number): string {
  return score.toFixed(1);
}

export function buildAssessmentResult(
  answers: AnswerMap,
  options: {
    assessmentType?: AssessmentType;
    deepLevel?: ProficiencyLevel;
    questions?: Array<{ id: string; competencyId: string }>;
  } = {},
): AssessmentResult {
  const directScores = new Map<string, number>();

  if (options.questions?.length) {
    const scoresByCompetency = new Map<string, number[]>();

    for (const question of options.questions) {
      const raw = answers[question.id];
      if (raw === undefined) continue;

      const bucket = scoresByCompetency.get(question.competencyId) ?? [];
      bucket.push(raw - 1);
      scoresByCompetency.set(question.competencyId, bucket);
    }

    for (const [competencyId, scores] of scoresByCompetency) {
      if (scores.length > 0) {
        directScores.set(competencyId, round(average(scores)));
      }
    }
  } else {
    for (const competency of allCompetencies) {
      const answered = competency.prompts
        .map((_, index) => answers[`${competency.id}:${index}`])
        .filter((value): value is number => value !== undefined);

      if (answered.length > 0) {
        directScores.set(competency.id, round(average(answered.map((raw) => raw - 1))));
      }
    }
  }

  const competencyScores = allCompetencies.map((competency) => {
    if (directScores.has(competency.id)) {
      return {
        competencyId: competency.id,
        areaId: competency.areaId,
        title: competency.shortTitle,
        score: directScores.get(competency.id)!,
      };
    }

    const areaAssessed = allCompetencies
      .filter((item) => item.areaId === competency.areaId && directScores.has(item.id))
      .map((item) => directScores.get(item.id)!);

    const score = areaAssessed.length > 0 ? round(average(areaAssessed)) : 1;

    return {
      competencyId: competency.id,
      areaId: competency.areaId,
      title: competency.shortTitle,
      score,
    };
  });

  const areaScores = digcompAreas.map((area) => {
    const matchingScores = competencyScores
      .filter((competency) => competency.areaId === area.id)
      .map((competency) => competency.score);
    const score = round(average(matchingScores));

    return {
      areaId: area.id,
      title: area.title,
      score,
      average: cohortAverages[area.id],
      percentile: scoreToPercentile(score),
    };
  });

  const overallScore = round(average(areaScores.map((area) => area.score)));
  const sortedCompetencies = [...competencyScores].sort((a, b) => b.score - a.score);

  const digitalType =
    options.assessmentType === "deep" && canClassifyDigitalType(new Set(directScores.keys()))
      ? classifyDigitalType(Object.fromEntries(directScores))
      : undefined;

  return {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    assessmentType: options.assessmentType ?? "basic",
    deepLevel: options.deepLevel,
    areaScores,
    competencyScores,
    overallScore,
    level: getLevel(overallScore),
    strengths: sortedCompetencies.slice(0, 3),
    growthAreas: sortedCompetencies.slice(-3).reverse(),
    digitalType,
  };
}

function normalizeAssessmentResult(result: AssessmentResult): AssessmentResult {
  const level = normalizeProficiencyLevel(result.level) ?? result.level;
  const deepLevel = result.deepLevel
    ? normalizeProficiencyLevel(result.deepLevel) ?? result.deepLevel
    : undefined;

  return {
    ...result,
    level,
    deepLevel,
  };
}

export function getHistory(): AssessmentResult[] {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(storageKeys.history);
  if (!raw) return [];

  try {
    return (JSON.parse(raw) as AssessmentResult[]).map(normalizeAssessmentResult);
  } catch {
    return [];
  }
}

export function clearAssessmentDraft(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(storageKeys.draftAnswers);
  window.localStorage.removeItem(storageKeys.draftQuestionIndex);
}

export function getDeepDraftKeys(level: ProficiencyLevel) {
  return {
    answers: `digcomp-navigator:draft-deep-${level}-answers`,
    questionIndex: `digcomp-navigator:draft-deep-${level}-index`,
  };
}

export function clearDeepAssessmentDraft(level: ProficiencyLevel): void {
  if (typeof window === "undefined") return;
  const keys = getDeepDraftKeys(level);
  window.localStorage.removeItem(keys.answers);
  window.localStorage.removeItem(keys.questionIndex);
}

export function getAssessmentType(result: AssessmentResult): AssessmentType {
  return result.assessmentType ?? "basic";
}

export function getLatestBasicResult(): AssessmentResult | null {
  return getHistory().find((result) => getAssessmentType(result) === "basic") ?? null;
}

export function getLatestDeepResult(level?: ProficiencyLevel): AssessmentResult | null {
  return (
    getHistory().find((result) => {
      if (getAssessmentType(result) !== "deep") return false;
      if (!level) return true;
      const deepLevel = normalizeProficiencyLevel(result.deepLevel);
      return deepLevel === level;
    }) ?? null
  );
}

export function getDeepResults(): AssessmentResult[] {
  return getHistory().filter((result) => getAssessmentType(result) === "deep");
}

export function getBasicResults(): AssessmentResult[] {
  return getHistory().filter((result) => getAssessmentType(result) === "basic");
}

export function saveResult(result: AssessmentResult): void {
  if (typeof window === "undefined") return;
  const history = getHistory();
  const nextHistory = [result, ...history].slice(0, 20);
  window.localStorage.setItem(storageKeys.latestResult, JSON.stringify(result));
  window.localStorage.setItem(storageKeys.history, JSON.stringify(nextHistory));
  clearAssessmentDraft();
}

export function getLatestResult(): AssessmentResult | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(storageKeys.latestResult);
  if (!raw) return getHistory()[0] ?? null;

  try {
    const parsed = JSON.parse(raw) as AssessmentResult;
    return normalizeAssessmentResult(parsed);
  } catch {
    return null;
  }
}

export function getProfile(): Profile {
  if (typeof window === "undefined") return defaultProfile;
  const raw = window.localStorage.getItem(storageKeys.profile);
  if (!raw) return defaultProfile;

  try {
    return { ...defaultProfile, ...(JSON.parse(raw) as Partial<Profile>) };
  } catch {
    return defaultProfile;
  }
}

export function saveProfile(profile: Profile): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(storageKeys.profile, JSON.stringify(profile));
}

function average(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function round(value: number): number {
  return Math.round(value * 100) / 100;
}
