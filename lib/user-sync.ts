import {
  defaultProfile,
  getHistory,
  getProfile,
  storageKeys,
  type AssessmentResult,
  type Profile,
} from "@/lib/scoring";

export const USER_DATA_RESTORED_EVENT = "digcomp-user-data-restored";

export function getOrCreateUserId(): string {
  if (typeof window === "undefined") return "";

  const existing = window.localStorage.getItem(storageKeys.userId);
  if (existing) return existing;

  const userId = crypto.randomUUID();
  window.localStorage.setItem(storageKeys.userId, userId);
  return userId;
}

export function setUserId(userId: string): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(storageKeys.userId, userId);
}

export function mergeHistoryFromServer(results: AssessmentResult[]): void {
  if (typeof window === "undefined" || results.length === 0) return;

  const local = getHistory();
  const byId = new Map<string, AssessmentResult>();

  for (const result of [...local, ...results]) {
    byId.set(result.id, result);
  }

  const merged = [...byId.values()]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 20);

  window.localStorage.setItem(storageKeys.history, JSON.stringify(merged));

  if (merged[0]) {
    window.localStorage.setItem(storageKeys.latestResult, JSON.stringify(merged[0]));
  }
}

export function applyProfileFromServer(profile: Profile): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(storageKeys.profile, JSON.stringify({ ...defaultProfile, ...profile }));
}

export async function pushUserDataToServer(options?: {
  profile?: Profile;
  result?: AssessmentResult;
  results?: AssessmentResult[];
}): Promise<boolean> {
  if (typeof window === "undefined") return false;

  const userId = getOrCreateUserId();
  const profile = options?.profile ?? getProfile();
  const results = options?.results ?? (options?.result ? [options.result] : undefined);

  try {
    const response = await fetch("/api/user-data", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, profile, results, result: options?.result }),
    });

    return response.ok;
  } catch {
    return false;
  }
}

export async function restoreUserDataFromServer(): Promise<boolean> {
  if (typeof window === "undefined") return false;

  const userId = getOrCreateUserId();
  const profile = getProfile();

  const query = profile.email?.trim()
    ? `email=${encodeURIComponent(profile.email.trim())}`
    : `userId=${encodeURIComponent(userId)}`;

  try {
    const response = await fetch(`/api/user-data?${query}`);
    if (!response.ok) return false;

    const data = (await response.json()) as {
      userId?: string;
      profile?: Profile | null;
      results?: AssessmentResult[];
    };

    if (data.userId && data.userId !== userId) {
      setUserId(data.userId);
    }

    if (data.profile) {
      applyProfileFromServer(data.profile);
    }

    if (data.results?.length) {
      mergeHistoryFromServer(data.results);
    }

    if (data.profile || data.results?.length) {
      window.dispatchEvent(new Event(USER_DATA_RESTORED_EVENT));
    }

    return Boolean(data.profile || data.results?.length);
  } catch {
    return false;
  }
}
