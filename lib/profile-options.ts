export const profileRoleOptions = [
  "실무 직원",
  "중간 관리자",
  "임원/대표",
  "회원(비상근)",
  "시민(무소속)",
] as const;

export const profileOrganizationOptions = [
  "시민사회단체",
  "복지기관",
  "재단",
  "협동조합",
  "기타/무소속",
] as const;

export function normalizeProfileRole(value: string | null | undefined): string {
  const trimmed = value?.trim();
  return trimmed ? trimmed : "미입력";
}

export function normalizeOrganizationType(value: string | null | undefined): string {
  const trimmed = value?.trim();
  if (!trimmed) return "미입력";
  if (trimmed === "기타") return "기타/무소속";
  return trimmed;
}
