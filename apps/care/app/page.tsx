import { redirect } from "next/navigation";

// У care нет отдельной «домашней» страницы: корень ведёт на выбор роли
export default function HomePage() {
  redirect("/vhod");
}
