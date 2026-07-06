import type { Metadata } from "next";
import { GoogleAnalyticsProvider } from "@/components/GoogleAnalyticsProvider";
import { SiteShell } from "@/components/SiteShell";
import "./globals.css";

export const metadata: Metadata = {
  title: "디지털역량진단 | DigComp 3.0 기반 자가진단",
  description: "DigComp 3.0 기준으로 한국 공익활동가의 디지털 역량을 자가진단하고 성장 추이를 확인하세요.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

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
        {gaMeasurementId ? <GoogleAnalyticsProvider measurementId={gaMeasurementId} /> : null}
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
