import type { Metadata } from "next";
import { ReviewsPage } from "@/components/pages/ReviewsPage";

export const metadata: Metadata = {
  title: "Отзывы",
  description: "Рейтинг клиники Amare и отзывы пациентов из открытых источников.",
};

export default function Page() {
  return <ReviewsPage />;
}
