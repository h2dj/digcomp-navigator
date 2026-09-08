/**
 * (가칭) 디지털 배움대학 관심 등록 폼의 관심 분야 선택지.
 * 기획안 7-1·7-3절 기준 — 복수 선택 가능.
 */
export type AcademyInterestId =
  | "ai"
  | "data"
  | "content"
  | "collaboration"
  | "safety"
  | "civic-tech"
  | "etc";

export type AcademyInterestOption = {
  id: AcademyInterestId;
  label: string;
};

export const academyInterestOptions: AcademyInterestOption[] = [
  { id: "ai", label: "AI" },
  { id: "data", label: "데이터" },
  { id: "content", label: "콘텐츠" },
  { id: "collaboration", label: "협업" },
  { id: "safety", label: "디지털 안전" },
  { id: "civic-tech", label: "시민기술·오픈소스" },
  { id: "etc", label: "기타" },
];

const academyInterestIds = academyInterestOptions.map((option) => option.id);

export function isAcademyInterestId(value: string): value is AcademyInterestId {
  return (academyInterestIds as string[]).includes(value);
}
