"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserDataBootstrap } from "@/components/UserDataBootstrap";
import { SiteHeader } from "@/components/SiteHeader";
import { brandLogoUrl } from "@/lib/brand";

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <UserDataBootstrap />
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
    </>
  );
}
