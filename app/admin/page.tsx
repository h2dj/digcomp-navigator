"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import type { UserSummary } from "@/lib/server-user-store";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/users");
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
  }, []);

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

      {loading ? <p className="muted">불러오는 중...</p> : null}
      {error ? <p className="form-error">{error}</p> : null}

      {!loading && users.length === 0 ? (
        <div className="empty-state">
          <h2>저장된 이용자가 없습니다</h2>
          <p className="muted">진단을 완료한 이용자 데이터가 서버에 동기화되면 여기에 표시됩니다.</p>
        </div>
      ) : null}

      {users.length > 0 ? (
        <div className="card admin-table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>이메일</th>
                <th>역할</th>
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
