import { redirect } from "next/navigation";

// У care нет отдельной «домашней» страницы — вход и кабинет решают роль
export default function HomePage() {
  redirect("/kabinet");
}
