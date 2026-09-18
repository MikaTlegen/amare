import type { Metadata } from "next";
import { RemotePage } from "@/components/pages/RemotePage";

export const metadata: Metadata = {
  title: "Иногородним",
  description: "Дистанционная реабилитация: онлайн-консультация, курс в Астане и домашняя программа.",
};

export default function Page() {
  return <RemotePage />;
}
