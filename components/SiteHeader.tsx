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
        <img
          className="brand-logo"
          src="https://cdn.ictact.kr/%EB%A1%9C%EA%B3%A0%EB%8B%A8%EC%B6%95%ED%98%95%20%EA%B0%80%EB%A1%9C.png"
          alt="IT 로고"
        />
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
