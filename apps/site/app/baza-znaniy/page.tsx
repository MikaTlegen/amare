import type { Metadata } from "next";
import { KnowledgePage } from "@/components/pages/KnowledgePage";

export const metadata: Metadata = {
  title: "База знаний",
  description: "Признаки инсульта, уход дома, питание при нарушении глотания и профилактика падений.",
};

export default function Page() {
  return <KnowledgePage />;
}
