import { Suspense } from "react";
import UnsubscribeClient from "./UnsubscribeClient";

export const metadata = { title: "Unsubscribe" };

export default function UnsubscribePage() {
  return (
    <Suspense fallback={null}>
      <UnsubscribeClient />
    </Suspense>
  );
}
