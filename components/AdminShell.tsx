"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const adminNavigation = [
  { href: "/admin", label: "이용자" },
  { href: "/admin/assessment", label: "진단 설정" },
  { href: "/admin/guide", label: "개발 가이드" },
  { href: "/admin/accounts", label: "관리자 계정" },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isLoginPage = pathname === "/admin/login";

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  if (isLoginPage) {
    return <div className="admin-root">{children}</div>;
  }

  return (
    <div className="admin-root">
      <header className="admin-header">
        <div>
          <span className="eyebrow">Admin</span>
          <strong className="admin-title">디지털역량진단 관리</strong>
        </div>
        <nav className="admin-nav" aria-label="관리자 메뉴">
          {adminNavigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href} className={isActive ? "active" : undefined}>
                {item.label}
              </Link>
            );
          })}
          <button className="text-button" type="button" onClick={handleLogout}>
            로그아웃
          </button>
        </nav>
      </header>
      <main className="admin-main">{children}</main>
    </div>
  );
}
