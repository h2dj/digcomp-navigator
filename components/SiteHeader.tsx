"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { brandLogoUrl } from "@/lib/brand";

const navigation = [
  { href: "/digcomp", label: "DigComp 소개" },
  { href: "/diagnosis", label: "기본 진단" },
  { href: "/stats", label: "공개 통계" },
  { href: "/dashboard", label: "나의 대시보드" },
  { href: "/guide", label: "개발 가이드" },
];

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="site-header">
      <Link href="/" className="brand" aria-label="디지털역량진단 홈">
        <img className="brand-logo" src={brandLogoUrl} alt="IT 로고" />
        <strong>디지털역량진단</strong>
      </Link>
      <nav aria-label="주요 메뉴">
        {navigation.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));

          return (
            <Link key={item.href} href={item.href} className={isActive ? "active" : undefined} aria-current={isActive ? "page" : undefined}>
              {item.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
