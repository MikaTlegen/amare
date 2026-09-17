import type { Metadata } from "next";
import { CoursePage } from "@/components/pages/CoursePage";

export const metadata: Metadata = { title: "Курс и цены" };

export default function Page() {
  return <CoursePage />;
}
