"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { formatScore, type AssessmentResult, type Profile } from "@/lib/scoring";

type UserDetail = {
  userId: string;
  profile: Profile;
  results: AssessmentResult[];
};

export default function AdminUserDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const userId = params.id;
  const [user, setUser] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadUser = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/admin/users/${userId}`);
      const data = (await response.json()) as UserDetail & { error?: string };
      if (!response.ok) {
        setError(data.error ?? "이용자 정보를 불러오지 못했습니다.");
        return;
      }
      setUser(data);
    } catch {
      setError("이용자 정보를 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    void loadUser();
  }, [loadUser]);

  async function handleDeleteUser() {
    if (!window.confirm("이 이용자와 모든 진단 결과를 삭제할까요?")) return;

    const response = await fetch(`/api/admin/users/${userId}`, { method: "DELETE" });
    if (!response.ok) {
      window.alert("삭제에 실패했습니다.");
      return;
    }

    router.push("/admin");
  }

  async function handleDeleteResult(resultId: string) {
    if (!window.confirm("이 진단 결과를 삭제할까요?")) return;

    const response = await fetch(`/api/admin/results/${resultId}`, { method: "DELETE" });
    if (!response.ok) {
      window.alert("삭제에 실패했습니다.");
      return;
    }

    await loadUser();
  }

  if (loading) {
    return <p className="muted admin-page">불러오는 중...</p>;
  }

  if (error || !user) {
    return (
      <section className="admin-page">
        <p className="form-error">{error || "이용자를 찾을 수 없습니다."}</p>
        <Link className="text-button" href="/admin">
          목록으로
        </Link>
      </section>
    );
  }

  return (
    <section className="admin-page">
      <div className="admin-page-header">
        <div>
          <Link className="text-button" href="/admin">
            &lt; 이용자 목록
          </Link>
          <h1>{user.profile.email || user.userId}</h1>
          <p className="muted admin-mono">{user.userId}</p>
        </div>
        <button className="button secondary danger-outline" type="button" onClick={() => void handleDeleteUser()}>
          이용자 삭제
        </button>
      </div>

      <div className="grid two">
        <article className="card">
          <span className="eyebrow">Profile</span>
          <h2>프로필</h2>
          <dl className="admin-detail-list">
            <div>
              <dt>이메일</dt>
              <dd>{user.profile.email || "-"}</dd>
            </div>
            <div>
              <dt>역할</dt>
              <dd>{user.profile.role}</dd>
            </div>
            <div>
              <dt>조직 유형</dt>
              <dd>{user.profile.organizationType}</dd>
            </div>
            <div>
              <dt>경력</dt>
              <dd>{user.profile.years}</dd>
            </div>
            <div>
              <dt>이메일 수신 동의</dt>
              <dd>{user.profile.emailOptIn ? "동의" : "미동의"}</dd>
            </div>
          </dl>
        </article>

        <article className="card">
          <span className="eyebrow">Results</span>
          <h2>진단 결과 ({user.results.length})</h2>
          {user.results.length === 0 ? <p className="muted">저장된 진단 결과가 없습니다.</p> : null}
          <ul className="admin-result-list">
            {user.results.map((result) => (
              <li key={result.id} className="admin-result-item">
                <div>
                  <strong>{formatScore(result.overallScore)} / 4.0</strong>
                  <span className="level-badge">{result.level}</span>
                  <p className="muted">{new Date(result.createdAt).toLocaleString("ko-KR")}</p>
                </div>
                <button className="text-button danger" type="button" onClick={() => void handleDeleteResult(result.id)}>
                  삭제
                </button>
              </li>
            ))}
          </ul>
        </article>
      </div>
    </section>
  );
}
