import { formatScore, type AssessmentResult } from "@/lib/scoring";

export function getSiteUrl(): string {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }

  return process.env.NEXT_PUBLIC_SITE_URL ?? "https://digcomp-navigator.vercel.app";
}

export function formatResultSummary(result: AssessmentResult): string {
  const date = new Date(result.createdAt).toLocaleString("ko-KR");
  const areaLines = result.areaScores
    .map((area) => `- ${area.title}: ${formatScore(area.score)}점`)
    .join("\n");
  const strengthLines = result.strengths.map((item) => `- ${item.title} (${formatScore(item.score)}점)`).join("\n");
  const growthLines = result.growthAreas.map((item) => `- ${item.title} (${formatScore(item.score)}점)`).join("\n");

  return [
    "디지털 역량 진단 결과",
    "",
    `진단일: ${date}`,
    `종합 점수: ${formatScore(result.overallScore)} / 4.0`,
    `숙련도: ${result.level}`,
    "",
    "[영역별 점수]",
    areaLines,
    "",
    "[강점 TOP 3]",
    strengthLines,
    "",
    "[개발 필요 TOP 3]",
    growthLines,
    "",
    `자세히 보기: ${getSiteUrl()}/results`,
    "",
    "DigComp 3.0 기반 · 공동체IT사회적협동조합",
  ].join("\n");
}

export function formatShareMessage(result: AssessmentResult): string {
  return `나의 디지털 역량 진단 결과: 종합 ${formatScore(result.overallScore)}점 (${result.level}). ${getSiteUrl()}`;
}

export function downloadResultJson(result: AssessmentResult): void {
  const blob = new Blob([JSON.stringify(result, null, 2)], { type: "application/json;charset=utf-8" });
  triggerDownload(blob, `digcomp-result-${result.id.slice(0, 8)}.json`);
}

export function downloadResultText(result: AssessmentResult): void {
  const blob = new Blob([formatResultSummary(result)], { type: "text/plain;charset=utf-8" });
  triggerDownload(blob, `digcomp-result-${result.id.slice(0, 8)}.txt`);
}

export function buildMailtoLink(result: AssessmentResult, recipient = ""): string {
  const subject = encodeURIComponent(`디지털 역량 진단 결과 (${result.level}, ${formatScore(result.overallScore)}점)`);
  const body = encodeURIComponent(formatResultSummary(result));
  const to = recipient ? encodeURIComponent(recipient) : "";
  return `mailto:${to}?subject=${subject}&body=${body}`;
}

export function buildTwitterShareUrl(result: AssessmentResult): string {
  const text = encodeURIComponent(formatShareMessage(result));
  return `https://twitter.com/intent/tweet?text=${text}`;
}

export function buildFacebookShareUrl(): string {
  const url = encodeURIComponent(`${getSiteUrl()}/results`);
  return `https://www.facebook.com/sharer/sharer.php?u=${url}`;
}

export async function copyResultSummary(result: AssessmentResult): Promise<void> {
  await navigator.clipboard.writeText(formatResultSummary(result));
}

export async function copyShareLink(result: AssessmentResult): Promise<void> {
  await navigator.clipboard.writeText(formatShareMessage(result));
}

export async function shareResultNative(result: AssessmentResult): Promise<boolean> {
  if (!navigator.share) return false;

  await navigator.share({
    title: "디지털 역량 진단 결과",
    text: formatShareMessage(result),
    url: `${getSiteUrl()}/results`,
  });

  return true;
}

function triggerDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}
