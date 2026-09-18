import type { Metadata } from "next";
import { ContactsPage } from "@/components/pages/ContactsPage";

export const metadata: Metadata = {
  title: "Контакты",
  description: "Адрес, телефоны, режим работы и карта клиники нейрореабилитации Amare в Астане.",
};

export default function Page() {
  return <ContactsPage />;
}
