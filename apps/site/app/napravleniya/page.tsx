import type { Metadata } from "next";
import { DirectionsPage } from "@/components/pages/DirectionsPage";

export const metadata: Metadata = { title: "Направления" };

export default function Page() {
  return <DirectionsPage />;
}
