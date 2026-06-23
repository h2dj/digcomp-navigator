import Link from "next/link";

const navigation = [
  { href: "/digcomp", label: "DigComp 안내" },
  { href: "/diagnosis", label: "진단하기" },
  { href: "/stats", label: "공개 통계" },
  { href: "/dashboard", label: "나의 대시보드" },
  { href: "/guide", label: "개발 가이드" },
];

export function SiteHeader() {
  return (
    <header className="site-header">
      <Link href="/" className="brand" aria-label="DigComp Navigator 홈">
        <span className="brand-mark">D</span>
        <span>
          <strong>DigComp Navigator</strong>
          <small>비영리 디지털 역량 진단</small>
        </span>
      </Link>
      <nav aria-label="주요 메뉴">
        {navigation.map((item) => (
          <Link key={item.href} href={item.href}>
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
