import type { Metadata } from "next";
import { FaqPage } from "@/components/pages/FaqPage";

export const metadata: Metadata = {
  title: "Вопросы и ответы",
  description: "Сроки, цены, документы и формат курса реабилитации в клинике Amare.",
};

export default function Page() {
  return <FaqPage />;
}
