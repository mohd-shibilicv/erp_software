import { Input } from "@/components/ui/input";
import { useState } from "react";
import { vehicleColumn } from "./CompanyTableColumns/VehicleColumn";
import { EmployeeCompanyCommonTable } from "../EmployeeManagment/Components/EmployeListTable";

export function VehicleList() {
  const [srch, setSrch] = useState("");
  return (
    <main className="w-full h-full bg-white rounded-md p-2">
      <section className="w-full">
        <div className="w-full flex justify-end">
          <Input
            value={srch}
            onChange={(e) => setSrch(e.target.value)}
            className="shadow-md md:w-[300px] w-full "
            placeholder="Search Vehicle name"
          />
        </div>

        <EmployeeCompanyCommonTable from="vehicle" columns={vehicleColumn} data={[]} />
      </section>
    </main>
  );
}
