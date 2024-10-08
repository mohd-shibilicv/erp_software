import { Input } from "@/components/ui/input";
import { useState } from "react";
import { EmployeeCompanyCommonTable } from "../EmployeeManagment/Components/EmployeListTable";
import { companyColumn } from "./CompanyTableColumns/CompanyColumn";

export function CompanyList() {
  const [srch, setSrch] = useState("");
  return (
    <main className="w-full h-full bg-white rounded-md p-2">
      <section className="w-full">
        <div className="w-full flex justify-end">
          <Input
            value={srch}
            onChange={(e) => setSrch(e.target.value)}
            className="shadow-md md:w-[300px] w-full "
            placeholder="Search Company name"
          />
        </div>

        <EmployeeCompanyCommonTable
          from="company"
          columns={companyColumn}
          data={[]}
        />
      </section>
    </main>
  );
}
