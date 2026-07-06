import { Suspense } from "react";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";

export function GoogleAnalyticsProvider({ measurementId }: { measurementId: string }) {
  return (
    <Suspense fallback={null}>
      <GoogleAnalytics measurementId={measurementId} />
    </Suspense>
  );
}
