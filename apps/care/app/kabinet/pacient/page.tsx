import type { Metadata } from "next";
import { RequireAuth } from "@/auth/RequireAuth";
import { PatientCabinetPage } from "@/components/PatientCabinetPage";

export const metadata: Metadata = { title: "Кабинет пациента" };

export default function Page() {
  return (
    <RequireAuth allow={["patient"]}>
      <PatientCabinetPage />
    </RequireAuth>
  );
}
