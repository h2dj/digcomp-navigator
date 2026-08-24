export type InterestTagId =
  | "general"
  | "environment"
  | "human-rights"
  | "labor"
  | "care"
  | "culture-arts"
  | "org-management"
  | "education";

export type InterestTag = {
  id: InterestTagId;
  label: string;
  description: string;
};

export const defaultInterestTagId: InterestTagId = "general";

export const interestTags: InterestTag[] = [
  { id: "environment", label: "환경", description: "기후·환경 이슈, 환경 보전 활동" },
  { id: "human-rights", label: "인권·시민참여", description: "인권 옹호, 시민참여, 소수자 권리" },
  { id: "labor", label: "노동", description: "노동 상담, 노동권 보장" },
  { id: "care", label: "돌봄", description: "복지·돌봄 서비스, 취약계층 지원" },
  { id: "culture-arts", label: "문화예술", description: "문화예술 기획, 접근성 확대" },
  { id: "org-management", label: "조직운영", description: "비영리조직 운영, 행정·회계" },
  { id: "education", label: "교육", description: "교육 프로그램 기획·운영" },
];

export function isInterestTagId(value: string): value is InterestTagId {
  return value === "general" || interestTags.some((tag) => tag.id === value);
}

export function getInterestTagLabel(id: InterestTagId): string {
  if (id === "general") return "일반";
  return interestTags.find((tag) => tag.id === id)?.label ?? "일반";
}
