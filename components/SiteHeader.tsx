"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { brandLogoUrl } from "@/lib/brand";

const navigation = [
  { href: "/digcomp", label: "DigComp 소개" },
  { href: "/diagnosis", label: "기본 진단" },
  { href: "/stats", label: "공개 통계" },
  { href: "/quiz", label: "OX 퀴즈" },
  { href: "/dashboard", label: "나의 대시보드" },
  { href: "/baeumdaehak", label: "(가칭) 디지털 배움대학" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // 경로가 바뀌면(메뉴 클릭 등) 모바일 드롭다운을 자동으로 닫는다.
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  return (
    <header className="site-header">
      <div className="site-header-bar">
        <Link href="/" className="brand" aria-label="디지털역량진단 홈">
          <img className="brand-logo" src={brandLogoUrl} alt="IT 로고" />
          <strong>디지털역량진단</strong>
        </Link>
        <button
          type="button"
          className="nav-toggle"
          aria-expanded={isMenuOpen}
          aria-controls="site-nav"
          aria-label={isMenuOpen ? "메뉴 닫기" : "메뉴 열기"}
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          <span className="nav-toggle-bar" aria-hidden="true" />
          <span className="nav-toggle-bar" aria-hidden="true" />
          <span className="nav-toggle-bar" aria-hidden="true" />
        </button>
      </div>
      <nav id="site-nav" aria-label="주요 메뉴" className={isMenuOpen ? "is-open" : undefined}>
        {navigation.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={isActive ? "active" : undefined}
              aria-current={isActive ? "page" : undefined}
              onClick={() => setIsMenuOpen(false)}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
