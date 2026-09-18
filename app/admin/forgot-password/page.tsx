"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

export default function AdminForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/admin/password/forgot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = (await response.json()) as { message?: string; error?: string };

      if (!response.ok) {
        setError(data.error ?? "요청 처리 중 오류가 발생했습니다.");
        return;
      }

      setMessage(data.message ?? "이메일을 확인해 주세요.");
    } catch {
      setError("요청 처리 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="admin-login">
      <article className="card admin-login-card">
        <span className="eyebrow">Admin</span>
        <h1>계정·비밀번호 찾기</h1>
        <p className="muted">가입하신 이메일을 입력하면 비밀번호를 재설정할 수 있는 링크를 보내드립니다.</p>

        <form className="admin-form" onSubmit={handleSubmit}>
          <label>
            이메일
            <input
              type="email"
              autoComplete="username"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>
          {error ? <p className="form-error">{error}</p> : null}
          {message ? <p className="form-success">{message}</p> : null}
          <button className="button" type="submit" disabled={loading}>
            {loading ? "전송 중..." : "재설정 링크 받기"}
          </button>
        </form>

        <p className="muted admin-login-footer-link">
          <Link className="text-button" href="/admin/login">
            로그인으로 돌아가기
          </Link>
        </p>
      </article>
    </section>
  );
}
