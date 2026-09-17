import type { Metadata } from "next";
import { NotFoundPage } from "@/components/pages/NotFoundPage";

export const metadata: Metadata = { title: "Страница не найдена" };

export default function NotFound() {
  return <NotFoundPage />;
}
