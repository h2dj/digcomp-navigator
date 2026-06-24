import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { brandLogoUrl } from "@/lib/brand";
import "./globals.css";

export const metadata: Metadata = {
  title: "디지털역량진단 | DigComp 3.0 기반 자가진단",
  description: "DigComp 3.0 기준으로 한국 공익활동가의 디지털 역량을 자가진단하고 성장 추이를 확인하세요.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;600;700&family=Noto+Serif+KR:wght@600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <SiteHeader />
        <main>{children}</main>
        <footer className="site-footer">
          <div className="footer-brand">
            <img className="brand-logo" src={brandLogoUrl} alt="IT 로고" />
            <strong>디지털역량진단</strong>
          </div>
          <p>유럽연합 DigComp 3.0 프레임워크를 기반으로 한국 공익활동가를 위해 제작되었습니다.</p>
          <p className="footer-provider">
            <a href="https://ictact.kr" target="_blank" rel="noreferrer">
              공동체IT사회적협동조합
            </a>
            이 제공합니다.
          </p>
          <p className="footer-copy">DigComp © European Union, 2022 · 한국어 서비스</p>
          <div className="footer-links">
            <Link href="/privacy">개인정보 보호 원칙</Link>
            <Link href="/stats">공개 통계</Link>
          </div>
        </footer>
      </body>
    </html>
  );
}
