"use client";

import { useState } from "react";
import {
  IconCopy,
  IconDownload,
  IconFacebook,
  IconMail,
  IconShare,
  IconX,
} from "@/components/ShareIcons";
import {
  buildFacebookShareUrl,
  buildTwitterShareUrl,
  copyResultSummary,
  downloadResultText,
  formatShareMessage,
  shareResultNative,
} from "@/lib/result-share";
import type { AssessmentResult } from "@/lib/scoring";

type ResultSharePanelProps = {
  result: AssessmentResult;
};

type Feedback = {
  type: "success" | "error";
  message: string;
};

export function ResultSharePanel({ result }: ResultSharePanelProps) {
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);

  async function handleCopySummary() {
    try {
      await copyResultSummary(result);
      setFeedback({ type: "success", message: "결과 요약이 클립보드에 복사되었습니다." });
    } catch {
      setFeedback({ type: "error", message: "복사에 실패했습니다. 브라우저 권한을 확인해주세요." });
    }
  }

  async function handleNativeShare() {
    try {
      const shared = await shareResultNative(result);
      if (!shared) {
        await navigator.clipboard.writeText(formatShareMessage(result));
        setFeedback({ type: "success", message: "공유 문구를 클립보드에 복사했습니다." });
      }
    } catch {
      setFeedback({ type: "error", message: "공유가 취소되었거나 실패했습니다." });
    }
  }

  async function handleSendEmail(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSending(true);
    setFeedback(null);

    try {
      const response = await fetch("/api/share/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, result }),
      });

      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        setFeedback({ type: "error", message: data.error ?? "이메일 발송에 실패했습니다." });
        return;
      }

      setFeedback({ type: "success", message: `${email}로 결과를 보냈습니다.` });
      setEmail("");
    } catch {
      setFeedback({ type: "error", message: "이메일 발송에 실패했습니다. 잠시 후 다시 시도해주세요." });
    } finally {
      setSending(false);
    }
  }

  return (
    <article className="card share-panel">
      <span className="eyebrow">저장 · 공유</span>
      <h2>결과를 저장하고 공유하기</h2>
      <p className="muted">
        요약을 저장하거나 이메일·SNS로 결과를 전달할 수 있습니다. 브라우저에도 자동 저장되어
        대시보드에서 다시 볼 수 있습니다.
      </p>

      <div className="share-row-duo">
        <button className="button secondary share-action" type="button" onClick={handleCopySummary}>
          <IconCopy className="share-action-icon" />
          요약 복사
        </button>
        <button className="button secondary share-action" type="button" onClick={() => downloadResultText(result)}>
          <IconDownload className="share-action-icon" />
          요약본 저장
        </button>
      </div>

      <form className="share-email-form" onSubmit={handleSendEmail}>
        <label className="share-email-field">
          <span className="sr-only">이메일 주소</span>
          <input
            type="email"
            name="email"
            placeholder="이메일 주소를 입력하세요"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            autoComplete="email"
          />
        </label>
        <button className="button share-email-submit" type="submit" disabled={sending}>
          <IconMail className="share-action-icon" />
          {sending ? "보내는 중…" : "이메일로 보내기"}
        </button>
      </form>

      <div className="share-social">
        <span className="share-social-label">SNS 공유</span>
        <button
          className="share-icon-button"
          type="button"
          aria-label="공유하기"
          title="공유하기"
          onClick={handleNativeShare}
        >
          <IconShare className="share-icon" />
        </button>
        <a
          className="share-icon-button"
          href={buildTwitterShareUrl(result)}
          target="_blank"
          rel="noreferrer"
          aria-label="X에 공유"
          title="X에 공유"
        >
          <IconX className="share-icon" />
        </a>
        <a
          className="share-icon-button"
          href={buildFacebookShareUrl()}
          target="_blank"
          rel="noreferrer"
          aria-label="Facebook에 공유"
          title="Facebook에 공유"
        >
          <IconFacebook className="share-icon" />
        </a>
      </div>

      {feedback ? (
        <p className={feedback.type === "success" ? "share-feedback success" : "share-feedback error"} role="status">
          {feedback.message}
        </p>
      ) : null}
    </article>
  );
}
