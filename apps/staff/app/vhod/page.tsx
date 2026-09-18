import type { Metadata } from "next";
import { LoginPage } from "@/components/LoginPage";

export const metadata: Metadata = { title: "Вход в рабочее место" };

export default function Page() {
  return <LoginPage />;
}
