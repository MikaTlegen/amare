import type { Metadata } from "next";
import { CabinetIndexPage } from "@/components/CabinetIndexPage";

export const metadata: Metadata = { title: "Кабинет" };

export default function Page() {
  return <CabinetIndexPage />;
}
