import { allCompetencies, digcompAreas, type DigcompAreaId } from "@/data/digcomp";

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

export type AssessmentResult = {
  id: string;
  createdAt: string;
  areaScores: AreaScore[];
  competencyScores: CompetencyScore[];
  overallScore: number;
  level: ProficiencyLevel;
  strengths: CompetencyScore[];
  growthAreas: CompetencyScore[];
};

export type Profile = {
  role: string;
  organizationType: string;
  years: string;
  emailOptIn: boolean;
};

export type ProficiencyLevel = "기초" | "중급" | "고급" | "전문가";

export const defaultProfile: Profile = {
  role: "실무 직원",
  organizationType: "시민사회단체",
  years: "1-3년",
  emailOptIn: false,
};

export const storageKeys = {
  latestResult: "digcomp-navigator:latest-result",
  history: "digcomp-navigator:history",
  profile: "digcomp-navigator:profile",
  draftAnswers: "digcomp-navigator:draft-answers",
};

export const cohortAverages: Record<DigcompAreaId, number> = {
  "information-data": 2.35,
  "communication-collaboration": 2.52,
  "content-creation": 2.08,
  safety: 1.94,
  "problem-solving": 2.16,
};

export const segmentAverages = {
  role: {
    "실무 직원": 2.18,
    "중간 관리자": 2.42,
    "교육 담당자": 2.55,
    "임원/대표": 2.06,
  },
  organizationType: {
    시민사회단체: 2.31,
    복지기관: 2.04,
    재단: 2.48,
    협동조합: 2.22,
    기타: 2.12,
  },
};

export const publicStats = {
  totalParticipants: 428,
  completedAssessments: 516,
  averageScore: 2.21,
  medianScore: 2.18,
  minimumSegmentSize: 10,
  organizationDistribution: [
    { name: "시민사회단체", value: 168 },
    { name: "복지기관", value: 96 },
    { name: "재단", value: 74 },
    { name: "협동조합", value: 45 },
    { name: "기타", value: 45 },
  ],
};

export function getLevel(score: number): ProficiencyLevel {
  if (score >= 3.4) return "전문가";
  if (score >= 2.5) return "고급";
  if (score >= 1.5) return "중급";
  return "기초";
}

export function scoreToPercentile(score: number): number {
  const normalized = Math.max(0, Math.min(4, score));
  return Math.round(12 + normalized * 20.5);
}

export function formatScore(score: number): string {
  return score.toFixed(1);
}

export function buildAssessmentResult(answers: AnswerMap): AssessmentResult {
  const competencyScores = allCompetencies.map((competency) => {
    const promptScores = competency.prompts.map((_, index) => {
      const raw = answers[`${competency.id}:${index}`] ?? 1;
      return raw - 1;
    });
    const score = average(promptScores);

    return {
      competencyId: competency.id,
      areaId: competency.areaId,
      title: competency.shortTitle,
      score: round(score),
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

  return {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    areaScores,
    competencyScores,
    overallScore,
    level: getLevel(overallScore),
    strengths: sortedCompetencies.slice(0, 3),
    growthAreas: sortedCompetencies.slice(-3).reverse(),
  };
}

export function getHistory(): AssessmentResult[] {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(storageKeys.history);
  if (!raw) return [];

  try {
    return JSON.parse(raw) as AssessmentResult[];
  } catch {
    return [];
  }
}

export function saveResult(result: AssessmentResult): void {
  if (typeof window === "undefined") return;
  const history = getHistory();
  const nextHistory = [result, ...history].slice(0, 20);
  window.localStorage.setItem(storageKeys.latestResult, JSON.stringify(result));
  window.localStorage.setItem(storageKeys.history, JSON.stringify(nextHistory));
  window.localStorage.removeItem(storageKeys.draftAnswers);
}

export function getLatestResult(): AssessmentResult | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(storageKeys.latestResult);
  if (!raw) return getHistory()[0] ?? null;

  try {
    return JSON.parse(raw) as AssessmentResult;
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
