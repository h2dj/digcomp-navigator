"use client";

import { Suspense, FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

function AdminResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("비밀번호는 8자 이상이어야 합니다.");
      return;
    }

    if (password !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/admin/password/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        setError(data.error ?? "비밀번호 재설정에 실패했습니다.");
        return;
      }

      setDone(true);
      setTimeout(() => router.push("/admin/login"), 2000);
    } catch {
      setError("비밀번호 재설정 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <section className="admin-login">
        <article className="card admin-login-card">
          <span className="eyebrow">Admin</span>
          <h1>비밀번호가 변경되었습니다</h1>
          <p className="form-success">잠시 후 로그인 화면으로 이동합니다.</p>
          <Link className="button" href="/admin/login">
            로그인하러 가기
          </Link>
        </article>
      </section>
    );
  }

  return (
    <section className="admin-login">
      <article className="card admin-login-card">
        <span className="eyebrow">Admin</span>
        <h1>새 비밀번호 설정</h1>

        {!token ? (
          <>
            <p className="form-error">유효하지 않은 링크입니다. 비밀번호 찾기를 다시 요청해 주세요.</p>
            <p className="muted admin-login-footer-link">
              <Link className="text-button" href="/admin/forgot-password">
                비밀번호 찾기로 이동
              </Link>
            </p>
          </>
        ) : (
          <form className="admin-form" onSubmit={handleSubmit}>
            <label>
              새 비밀번호
              <input
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                minLength={8}
                required
              />
            </label>
            <label>
              새 비밀번호 확인
              <input
                type="password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                minLength={8}
                required
              />
            </label>
            {error ? <p className="form-error">{error}</p> : null}
            <button className="button" type="submit" disabled={loading}>
              {loading ? "변경 중..." : "비밀번호 변경"}
            </button>
          </form>
        )}
      </article>
    </section>
  );
}

export default function AdminResetPasswordPage() {
  return (
    <Suspense fallback={<p className="muted admin-login">불러오는 중...</p>}>
      <AdminResetPasswordForm />
    </Suspense>
  );
}
