type GtagWindow = Window & {
  gtag?: (...args: unknown[]) => void;
};

type AnalyticsParams = Record<string, string | number | boolean>;

export function trackEvent(eventName: string, params?: AnalyticsParams): void {
  if (typeof window === "undefined") return;
  if (!process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID) return;

  (window as GtagWindow).gtag?.("event", eventName, params);
}

export function trackAssessmentStart(assessmentType: "basic" | "deep", deepLevel?: string): void {
  trackEvent("assessment_start", {
    assessment_type: assessmentType,
    ...(deepLevel ? { deep_level: deepLevel } : {}),
  });
}

export function trackAssessmentComplete(
  assessmentType: "basic" | "deep",
  params: { level: string; overallScore: number; deepLevel?: string },
): void {
  trackEvent("assessment_complete", {
    assessment_type: assessmentType,
    proficiency_level: params.level,
    overall_score: params.overallScore,
    ...(params.deepLevel ? { deep_level: params.deepLevel } : {}),
  });
}

export function trackProfileSave(params: {
  hasEmail: boolean;
  role: string;
  organizationType: string;
}): void {
  trackEvent("profile_save", {
    has_email: params.hasEmail,
    role: params.role,
    organization_type: params.organizationType,
  });
}
