import { Suspense } from "react";
import UnsubscribeClient from "./UnsubscribeClient";

export const metadata = {
  title: "Unsubscribe",
  robots: { index: false, follow: false },
};

export default function UnsubscribePage() {
  return (
    <Suspense fallback={null}>
      <UnsubscribeClient />
    </Suspense>
  );
}
