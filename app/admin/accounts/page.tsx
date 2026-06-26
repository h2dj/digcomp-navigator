"use client";

import { useCallback, useEffect, useState } from "react";
import type { AdminAccount } from "@/lib/admin-store";

export default function AdminAccountsPage() {
  const [accounts, setAccounts] = useState<AdminAccount[]>([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminGroup, setAdminGroup] = useState("admin");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadAccounts = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/accounts");
      const data = (await response.json()) as { accounts?: AdminAccount[]; error?: string };
      if (!response.ok) {
        setError(data.error ?? "관리자 계정을 불러오지 못했습니다.");
        return;
      }
      setAccounts(data.accounts ?? []);
    } catch {
      setError("관리자 계정을 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadAccounts();
  }, [loadAccounts]);

  async function handleCreate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch("/api/admin/accounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, adminGroup }),
      });
      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        setError(data.error ?? "계정 생성에 실패했습니다.");
        return;
      }

      setEmail("");
      setPassword("");
      setMessage("관리자 계정을 추가했습니다.");
      await loadAccounts();
    } catch {
      setError("계정 생성 중 오류가 발생했습니다.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(adminId: string) {
    if (!window.confirm("이 관리자 계정을 삭제할까요?")) return;

    const response = await fetch("/api/admin/accounts", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ adminId }),
    });

    if (!response.ok) {
      window.alert("삭제에 실패했습니다.");
      return;
    }

    await loadAccounts();
  }

  return (
    <section className="admin-page">
      <div className="admin-page-header">
        <div>
          <span className="eyebrow">Accounts</span>
          <h1>관리자 계정</h1>
          <p className="muted">관리자 그룹 계정을 추가하고 삭제할 수 있습니다.</p>
        </div>
      </div>

      <div className="grid two">
        <article className="card">
          <h2>계정 추가</h2>
          <form className="admin-form" onSubmit={(event) => void handleCreate(event)}>
            <label>
              이메일
              <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
            </label>
            <label>
              비밀번호
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                minLength={8}
                required
              />
            </label>
            <label>
              관리자 그룹
              <input
                type="text"
                value={adminGroup}
                onChange={(event) => setAdminGroup(event.target.value)}
                placeholder="admin"
                required
              />
            </label>
            {message ? <p className="form-success">{message}</p> : null}
            {error ? <p className="form-error">{error}</p> : null}
            <button className="button" type="submit" disabled={saving}>
              {saving ? "추가 중..." : "계정 추가"}
            </button>
          </form>
        </article>

        <article className="card">
          <h2>등록된 계정 ({accounts.length})</h2>
          {loading ? <p className="muted">불러오는 중...</p> : null}
          {!loading && accounts.length === 0 ? <p className="muted">등록된 관리자 계정이 없습니다.</p> : null}
          <ul className="admin-account-list">
            {accounts.map((account) => (
              <li key={account.id} className="admin-account-item">
                <div>
                  <strong>{account.email}</strong>
                  <p className="muted">
                    그룹: {account.adminGroup} · {new Date(account.createdAt).toLocaleString("ko-KR")}
                  </p>
                </div>
                <button className="text-button danger" type="button" onClick={() => void handleDelete(account.id)}>
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
