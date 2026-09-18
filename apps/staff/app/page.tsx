import { RequireAuth } from "@/auth/RequireAuth";
import { StaffCabinetPage } from "@/components/StaffCabinetPage";

export default function HomePage() {
  return (
    <RequireAuth>
      <StaffCabinetPage />
    </RequireAuth>
  );
}
