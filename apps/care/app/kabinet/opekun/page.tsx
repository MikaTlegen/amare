import type { Metadata } from "next";
import { RequireAuth } from "@/auth/RequireAuth";
import { GuardianCabinetPage } from "@/components/GuardianCabinetPage";

export const metadata: Metadata = { title: "Кабинет опекуна" };

export default function Page() {
  return (
    <RequireAuth allow={["guardian"]}>
      <GuardianCabinetPage />
    </RequireAuth>
  );
}
