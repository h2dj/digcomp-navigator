"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import { digitalTypeCardContent } from "@/data/digital-type-cards";
import { digitalTypeCardContentEn } from "@/data/digital-type-cards.en";
import type { DigitalTypeId } from "@/data/digital-types";
import type { MiniTestLocale } from "@/data/mini-type-test";

type DigitalTypePrescriptionCardProps = {
  typeId: DigitalTypeId;
  typeName: string;
  locale?: MiniTestLocale;
};

const uiStrings = {
  ko: {
    badge: "Rx · 디지털 미니 처방전",
    strengthsTitle: "⭐ 이런 강점이 있어요",
    cautionsTitle: "❗ 이런 점은 조심해요",
    prescriptionTitle: "💊 오늘의 처방",
    remember: "기억하세요!",
    growthTitle: "📈 성장 가이드",
    growthSubtitle: "더 멀리 성장하기 위한 실천 방법",
    toolsTitle: "🔧 추천 도구·자료",
    footerLine1: "다양한 사람들이 만드는 더 좋은 디지털 사회",
    footerLine2: "나의 가능성이, 더 나은 변화를 만듭니다.",
    printButton: "인쇄하기",
    imageButton: "이미지로 저장",
    pdfButton: "PDF로 저장",
    saving: "저장 중...",
    imageError: "이미지를 만드는 중 문제가 발생했어요. 잠시 후 다시 시도해주세요.",
    pdfError: "PDF를 만드는 중 문제가 발생했어요. 잠시 후 다시 시도해주세요.",
    fileSuffix: "디지털미니처방전",
  },
  en: {
    badge: "Rx · Digital Mini Prescription",
    strengthsTitle: "⭐ Your Strengths",
    cautionsTitle: "❗ Watch Out For",
    prescriptionTitle: "💊 Today's Prescription",
    remember: "REMEMBER",
    growthTitle: "📈 Growth Guide",
    growthSubtitle: "Practical steps to keep growing",
    toolsTitle: "🔧 Suggested Tools & Resources",
    footerLine1: "A better digital society, built by all kinds of people.",
    footerLine2: "Your potential leads to meaningful change.",
    printButton: "Print",
    imageButton: "Save as Image",
    pdfButton: "Save as PDF",
    saving: "Saving...",
    imageError: "Something went wrong while creating the image. Please try again in a moment.",
    pdfError: "Something went wrong while creating the PDF. Please try again in a moment.",
    fileSuffix: "digital-mini-prescription",
  },
} satisfies Record<MiniTestLocale, Record<string, string>>;

function withLineBreaks(lines: string[], keyPrefix: string) {
  return lines.map((line, index) => (
    <span key={`${keyPrefix}-${index}`}>
      {line}
      {index < lines.length - 1 ? <br /> : null}
    </span>
  ));
}

/** 액션바(버튼)를 가려서 캡처하기 위한 html2canvas 옵션 */
function ignoreActionbar(element: Element): boolean {
  return element.classList?.contains("rx-card-actionbar") ?? false;
}

async function captureCardCanvas(card: HTMLElement) {
  const { default: html2canvas } = await import("html2canvas");
  return html2canvas(card, {
    scale: 2,
    backgroundColor: "#ffffff",
    useCORS: true,
    ignoreElements: ignoreActionbar,
  });
}

function triggerDownload(href: string, filename: string) {
  const link = document.createElement("a");
  link.href = href;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * 서울공익활동박람회 부스에서 배포한 "디지털 미니 처방전" 웹페이지(16종)를
 * 그대로 옮긴 카드. 강점·주의점·오늘의 처방·성장 가이드·추천 도구를 담고 있다.
 * locale이 "en"이면 미니 테스트 영문 모드에서 사용하는 영문 콘텐츠를 보여준다.
 */
export function DigitalTypePrescriptionCard({ typeId, typeName, locale = "ko" }: DigitalTypePrescriptionCardProps) {
  const content = locale === "en" ? digitalTypeCardContentEn[typeId] : digitalTypeCardContent[typeId];
  const t = uiStrings[locale];
  const cardRef = useRef<HTMLElement>(null);
  const [pending, setPending] = useState<"image" | "pdf" | null>(null);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const themeStyle = {
    "--rx-theme": content.themeColor,
    "--rx-soft": content.softColor,
  } as CSSProperties;

  async function handleDownloadImage() {
    if (!cardRef.current || pending) return;
    setPending("image");
    setError("");

    try {
      const canvas = await captureCardCanvas(cardRef.current);
      triggerDownload(canvas.toDataURL("image/png"), `${typeName}_${t.fileSuffix}.png`);
    } catch {
      setError(t.imageError);
    } finally {
      setPending(null);
    }
  }

  async function handleDownloadPdf() {
    if (!cardRef.current || pending) return;
    setPending("pdf");
    setError("");

    try {
      const canvas = await captureCardCanvas(cardRef.current);
      const { jsPDF } = await import("jspdf");
      const pdf = new jsPDF({
        orientation: canvas.width > canvas.height ? "landscape" : "portrait",
        unit: "px",
        format: [canvas.width, canvas.height],
      });
      pdf.addImage(canvas.toDataURL("image/jpeg", 0.92), "JPEG", 0, 0, canvas.width, canvas.height);
      pdf.save(`${typeName}_${t.fileSuffix}.pdf`);
    } catch {
      setError(t.pdfError);
    } finally {
      setPending(null);
    }
  }

  const cardBody = (
    <>
      <div className="rx-card-hero">
        <div>
          <span className="rx-card-badge">{t.badge}</span>
          <h2 className="rx-card-name">{typeName}</h2>
          <p className="rx-card-lead">{withLineBreaks(content.leadLines, "lead")}</p>
          <span className="rx-card-tag">{content.tag}</span>
        </div>
        <div className="rx-card-hero-art">
          <div className="rx-card-speech">{withLineBreaks(content.speechLines, "speech")}</div>
          <div className="rx-card-emoji" aria-hidden="true">
            {content.emoji}
          </div>
        </div>
      </div>

      <div className="rx-card-grid2">
        <article className="rx-card-panel rx-card-good">
          <h3>{t.strengthsTitle}</h3>
          <ul>
            {content.strengths.map((item, index) => (
              <li key={index}>
                <span className="rx-card-dot">✓</span>
                {item}
              </li>
            ))}
          </ul>
        </article>
        <article className="rx-card-panel rx-card-warn">
          <h3>{t.cautionsTitle}</h3>
          <ul>
            {content.cautions.map((item, index) => (
              <li key={index}>
                <span className="rx-card-dot is-warn">!</span>
                {item}
              </li>
            ))}
          </ul>
        </article>
      </div>

      <div className="rx-card-rxbox">
        <div>
          <h3>{t.prescriptionTitle}</h3>
          <p className="rx-card-quote">{content.prescriptionQuote}</p>
          <ul>
            {content.prescriptionItems.map((item, index) => (
              <li key={index}>
                <span className="rx-card-dot">✓</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
        <aside className="rx-card-sticky">
          <strong>{t.remember}</strong>
          {content.stickyLines.map((line, index) => (
            <p key={index}>{line}</p>
          ))}
        </aside>
      </div>

      <div className="rx-card-growth">
        <h3>
          {t.growthTitle} <small>{t.growthSubtitle}</small>
        </h3>
        <div className="rx-card-steps">
          {content.growthSteps.map((step, index) => (
            <div className="rx-card-step" key={index}>
              <span className="rx-card-step-num">{index + 1}</span>
              <span className="rx-card-step-title">{step.title}</span>
              <span className="rx-card-step-desc">{step.desc}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="rx-card-tools">
        <div className="rx-card-message">
          <span aria-hidden="true">{content.messageEmoji}</span> {withLineBreaks(content.messageLines, "message")}
        </div>
        <div className="rx-card-toolbox">
          <h3>{t.toolsTitle}</h3>
          <ul>
            {content.tools.map((tool, index) => (
              <li key={index}>{tool}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="rx-card-footer">
        <span>{t.footerLine1}</span>
        <span>{t.footerLine2}</span>
      </div>

      <div className="rx-card-credit">공동체IT사회적협동조합 · https://ictact.kr</div>
    </>
  );

  return (
    <section className="rx-card" style={themeStyle} ref={cardRef}>
      <div className="rx-card-actionbar">
        <button type="button" onClick={() => window.print()} disabled={pending !== null}>
          {t.printButton}
        </button>
        <button type="button" onClick={() => void handleDownloadImage()} disabled={pending !== null}>
          {pending === "image" ? t.saving : t.imageButton}
        </button>
        <button type="button" onClick={() => void handleDownloadPdf()} disabled={pending !== null}>
          {pending === "pdf" ? t.saving : t.pdfButton}
        </button>
      </div>

      {error ? <p className="rx-card-error">{error}</p> : null}

      {cardBody}

      {mounted
        ? createPortal(
            <section className="rx-card rx-print-portal" style={themeStyle}>
              {cardBody}
            </section>,
            document.body,
          )
        : null}
    </section>
  );
}
