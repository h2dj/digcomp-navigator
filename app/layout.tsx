import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import "./globals.css";

export const metadata: Metadata = {
  title: "DigComp Navigator | 비영리 디지털 역량 진단",
  description: "DigComp 3.0 기준으로 한국 공익활동가의 디지털 역량을 자가진단하고 성장 추이를 확인하세요.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body>
        <SiteHeader />
        <main>{children}</main>
        <footer className="site-footer">
          <div>
            <strong>DigComp Navigator</strong>
            <p>비영리조직 임직원을 위한 무료 디지털 역량 자가진단 플랫폼 MVP</p>
          </div>
          <div className="footer-links">
            <Link href="/privacy">개인정보 보호 원칙</Link>
            <Link href="/stats">공개 통계</Link>
          </div>
        </footer>
      </body>
    </html>
  );
}
