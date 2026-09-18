import type { Metadata } from "next";
import { ResultsPage } from "@/components/pages/ResultsPage";

export const metadata: Metadata = {
  title: "Результаты и истории восстановления",
  description: "Истории пациентов клиники Amare: что было до курса реабилитации и что стало после.",
};

export default function Page() {
  return <ResultsPage />;
}
