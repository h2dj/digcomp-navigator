"use client";

import Link from "next/link";
import { useCallback, useEffect, useState, type FormEvent } from "react";
import { allDigitalTypeIds, getDigitalTypeDefinition, isDigitalTypeId } from "@/data/digital-types";
import { proficiencyLevels, type ProficiencyLevel } from "@/lib/scoring";
import type { UserSummary } from "@/lib/server-user-store";

const roleOptions = ["실무 직원", "중간 관리자", "교육 담당자", "임원/대표"];
const organizationOptions = ["시민사회단체", "복지기관", "재단", "협동조합", "기타"];
const pageSize = 20;

const sortOptions: { value: string; label: string }[] = [
  { value: "updatedAt", label: "업데이트 최신순" },
  { value: "latestResultAt", label: "최근 진단일순" },
  { value: "resultCount", label: "진단 많은순" },
  { value: "email", label: "이메일순" },
];

type UsersResponse = { users?: UserSummary[]; total?: number; error?: string };

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserSummary[]>([]);
  const [total, setTotal] = useState(0);
  const [roleFilter, setRoleFilter] = useState("");
  const [organizationFilter, setOrganizationFilter] = useState("");
  const [levelFilter, setLevelFilter] = useState<ProficiencyLevel | "">("");
  const [digitalTypeFilter, setDigitalTypeFilter] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [emailQuery, setEmailQuery] = useState("");
  const [hasResultsOnly, setHasResultsOnly] = useState(false);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [sort, setSort] = useState(sortOptions[0].value);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams();
      params.set("limit", String(pageSize));
      params.set("offset", String((page - 1) * pageSize));
      if (roleFilter) params.set("role", roleFilter);
      if (organizationFilter) params.set("organizationType", organizationFilter);
      if (levelFilter) params.set("level", levelFilter);
      if (digitalTypeFilter) params.set("digitalTypeId", digitalTypeFilter);
      if (emailQuery) params.set("email", emailQuery);
      if (hasResultsOnly) params.set("hasResults", "true");
      if (dateFrom) params.set("from", dateFrom);
      if (dateTo) params.set("to", dateTo);
      if (sort) params.set("sort", sort);

      const response = await fetch(`/api/admin/users?${params.toString()}`);
      const data = (await response.json()) as UsersResponse;
      if (!response.ok) {
        setError(data.error ?? "이용자 목록을 불러오지 못했습니다.");
        return;
      }
      setUsers(data.users ?? []);
      setTotal(data.total ?? 0);
    } catch {
      setError("이용자 목록을 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  }, [
    roleFilter,
    organizationFilter,
    levelFilter,
    digitalTypeFilter,
    emailQuery,
    hasResultsOnly,
    dateFrom,
    dateTo,
    sort,
    page,
  ]);

  useEffect(() => {
    void loadUsers();
  }, [loadUsers]);

  // 필터·정렬이 바뀌면 1페이지부터 다시 본다.
  useEffect(() => {
    setPage(1);
  }, [roleFilter, organizationFilter, levelFilter, digitalTypeFilter, emailQuery, hasResultsOnly, dateFrom, dateTo, sort]);

  async function handleDelete(userId: string) {
    if (!window.confirm("이 이용자와 모든 진단 결과를 삭제할까요?")) return;

    const response = await fetch(`/api/admin/users/${userId}`, { method: "DELETE" });
    if (!response.ok) {
      window.alert("삭제에 실패했습니다.");
      return;
    }

    await loadUsers();
  }

  function handleEmailSearchSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setEmailQuery(emailInput.trim());
  }

  function resetFilters() {
    setRoleFilter("");
    setOrganizationFilter("");
    setLevelFilter("");
    setDigitalTypeFilter("");
    setEmailInput("");
    setEmailQuery("");
    setHasResultsOnly(false);
    setDateFrom("");
    setDateTo("");
  }

  const hasActiveFilters = Boolean(
    roleFilter ||
      organizationFilter ||
      levelFilter ||
      digitalTypeFilter ||
      emailQuery ||
      hasResultsOnly ||
      dateFrom ||
      dateTo,
  );
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

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

      <div className="admin-assessment-tabs" role="tablist" aria-label="역량 등급 필터">
        <button type="button" className={levelFilter === "" ? "active" : undefined} onClick={() => setLevelFilter("")}>
          전체 등급
        </button>
        {proficiencyLevels.map((level) => (
          <button
            key={level}
            type="button"
            className={levelFilter === level ? "active" : undefined}
            onClick={() => setLevelFilter(level)}
          >
            {level}
          </button>
        ))}
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
          <label>
            디지털 유형
            <select value={digitalTypeFilter} onChange={(event) => setDigitalTypeFilter(event.target.value)}>
              <option value="">전체</option>
              {allDigitalTypeIds.map((id) => (
                <option key={id} value={id}>
                  {getDigitalTypeDefinition(id).name}
                </option>
              ))}
            </select>
          </label>
          <label>
            정렬
            <select value={sort} onChange={(event) => setSort(event.target.value)}>
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <form className="admin-email-search" onSubmit={handleEmailSearchSubmit}>
          <label>
            이메일 검색
            <input
              type="search"
              value={emailInput}
              onChange={(event) => setEmailInput(event.target.value)}
              placeholder="이메일 일부를 입력하세요"
            />
          </label>
          <button className="button secondary" type="submit">
            검색
          </button>
        </form>

        <div className="admin-date-range">
          <label>
            진단 기간(시작)
            <input type="date" value={dateFrom} onChange={(event) => setDateFrom(event.target.value)} max={dateTo || undefined} />
          </label>
          <span className="admin-date-range-sep" aria-hidden="true">
            ~
          </span>
          <label>
            진단 기간(종료)
            <input type="date" value={dateTo} onChange={(event) => setDateTo(event.target.value)} min={dateFrom || undefined} />
          </label>
        </div>

        <label className="admin-checkbox-field">
          <input type="checkbox" checked={hasResultsOnly} onChange={(event) => setHasResultsOnly(event.target.checked)} />
          진단을 실제로 수행한 사람만 보기
        </label>

        {hasActiveFilters ? (
          <p className="muted admin-filter-summary">
            <button className="text-button" type="button" onClick={resetFilters}>
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
              ? "다른 조건을 선택해 보세요."
              : "진단을 완료한 이용자 데이터가 서버에 동기화되면 여기에 표시됩니다."}
          </p>
        </div>
      ) : null}

      {users.length > 0 ? (
        <>
          <div className="card admin-table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>이메일</th>
                  <th>역할</th>
                  <th>조직 유형</th>
                  <th>등급</th>
                  <th>유형</th>
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
                    <td>{user.latestLevel ? <span className="level-badge">{user.latestLevel}</span> : "-"}</td>
                    <td>
                      {user.latestDigitalTypeId && isDigitalTypeId(user.latestDigitalTypeId)
                        ? getDigitalTypeDefinition(user.latestDigitalTypeId).name
                        : "-"}
                    </td>
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

          <div className="admin-pagination">
            <button
              className="button secondary"
              type="button"
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              disabled={page <= 1}
            >
              이전
            </button>
            <span className="muted">
              {page} / {totalPages} 페이지 · 총 {total}명
            </span>
            <button
              className="button secondary"
              type="button"
              onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
              disabled={page >= totalPages}
            >
              다음
            </button>
          </div>
        </>
      ) : null}
    </section>
  );
}
