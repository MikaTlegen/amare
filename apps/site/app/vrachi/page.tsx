import type { Metadata } from "next";
import { Suspense } from "react";
import { TeamPage } from "@/components/pages/TeamPage";

export const metadata: Metadata = { title: "Врачи" };

// Страница читает параметры адреса (useSearchParams) — Next требует границу Suspense
export default function Page() {
  return (
    <Suspense>
      <TeamPage />
    </Suspense>
  );
}
