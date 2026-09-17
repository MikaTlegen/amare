import type { Metadata } from "next";
import { IntakeFormPage } from "@/components/pages/IntakeFormPage";

export const metadata: Metadata = { title: "Анкета пациента" };

export default function Page() {
  return <IntakeFormPage />;
}
