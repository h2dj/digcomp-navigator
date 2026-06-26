"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import type { UserSummary } from "@/lib/server-user-store";

const roleOptions = ["실무 직원", "중간 관리자", "교육 담당자", "임원/대표"];
const organizationOptions = ["시민사회단체", "복지기관", "재단", "협동조합", "기타"];

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserSummary[]>([]);
  const [roleFilter, setRoleFilter] = useState("");
  const [organizationFilter, setOrganizationFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams();
      if (roleFilter) params.set("role", roleFilter);
      if (organizationFilter) params.set("organizationType", organizationFilter);

      const query = params.toString();
      const response = await fetch(`/api/admin/users${query ? `?${query}` : ""}`);
      const data = (await response.json()) as { users?: UserSummary[]; error?: string };
      if (!response.ok) {
        setError(data.error ?? "이용자 목록을 불러오지 못했습니다.");
        return;
      }
      setUsers(data.users ?? []);
    } catch {
      setError("이용자 목록을 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  }, [roleFilter, organizationFilter]);

  useEffect(() => {
    void loadUsers();
  }, [loadUsers]);

  async function handleDelete(userId: string) {
    if (!window.confirm("이 이용자와 모든 진단 결과를 삭제할까요?")) return;

    const response = await fetch(`/api/admin/users/${userId}`, { method: "DELETE" });
    if (!response.ok) {
      window.alert("삭제에 실패했습니다.");
      return;
    }

    await loadUsers();
  }

  const hasActiveFilters = Boolean(roleFilter || organizationFilter);

  return (
    <section className="admin-page">
      <div className="admin-page-header">
        <div>
          <span className="eyebrow">Users</span>
          <h1>이용자 관리</h1>
          <p className="muted">서버에 저장된 이용자별 프로필과 진단 결과를 조회·삭제할 수 있습니다.</p>
        </div>
        <button className="button secondary" type="button" onClick={() => void loadUsers()}>
          새로고침
        </button>
      </div>

      <article className="card admin-filters">
        <div className="admin-filter-grid">
          <label>
            역할
            <select value={roleFilter} onChange={(event) => setRoleFilter(event.target.value)}>
              <option value="">전체</option>
              {roleOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
          <label>
            조직 유형
            <select value={organizationFilter} onChange={(event) => setOrganizationFilter(event.target.value)}>
              <option value="">전체</option>
              {organizationOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
        </div>
        {hasActiveFilters ? (
          <p className="muted admin-filter-summary">
            {users.length}명 표시 중
            <button
              className="text-button"
              type="button"
              onClick={() => {
                setRoleFilter("");
                setOrganizationFilter("");
              }}
            >
              필터 초기화
            </button>
          </p>
        ) : null}
      </article>

      {loading ? <p className="muted">불러오는 중...</p> : null}
      {error ? <p className="form-error">{error}</p> : null}

      {!loading && users.length === 0 ? (
        <div className="empty-state">
          <h2>{hasActiveFilters ? "조건에 맞는 이용자가 없습니다" : "저장된 이용자가 없습니다"}</h2>
          <p className="muted">
            {hasActiveFilters
              ? "다른 역할이나 조직 유형을 선택해 보세요."
              : "진단을 완료한 이용자 데이터가 서버에 동기화되면 여기에 표시됩니다."}
          </p>
        </div>
      ) : null}

      {users.length > 0 ? (
        <div className="card admin-table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>이메일</th>
                <th>역할</th>
                <th>조직 유형</th>
                <th>진단 수</th>
                <th>최근 진단</th>
                <th>업데이트</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.userId}>
                  <td>
                    <div className="admin-user-cell">
                      <strong>{user.email || "이메일 없음"}</strong>
                      <span className="muted admin-mono">{user.userId}</span>
                    </div>
                  </td>
                  <td>{user.profile.role}</td>
                  <td>{user.profile.organizationType}</td>
                  <td>{user.resultCount}</td>
                  <td>{user.latestResultAt ? new Date(user.latestResultAt).toLocaleString("ko-KR") : "-"}</td>
                  <td>{new Date(user.updatedAt).toLocaleString("ko-KR")}</td>
                  <td className="admin-actions-cell">
                    <Link className="text-button" href={`/admin/users/${user.userId}`}>
                      상세
                    </Link>
                    <button className="text-button danger" type="button" onClick={() => void handleDelete(user.userId)}>
                      삭제
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </section>
  );
}
