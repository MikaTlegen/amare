import type { Metadata } from "next";
import { Suspense } from "react";
import { BookingPage } from "@/components/pages/BookingPage";

export const metadata: Metadata = { title: "Запись на консультацию" };

// Страница читает параметры адреса (useSearchParams) — Next требует границу Suspense
export default function Page() {
  return (
    <Suspense>
      <BookingPage />
    </Suspense>
  );
}
