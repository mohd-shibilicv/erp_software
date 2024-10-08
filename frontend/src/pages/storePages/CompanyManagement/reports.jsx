import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  companyReportHeading,
  companyReportKeys,
} from "@/constants/companyManagementRelated";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { EmployeeCompanyCommonTable } from "../EmployeeManagment/Components/EmployeListTable";
import { companyColumn } from "./CompanyTableColumns/CompanyColumn";
import { vehicleReportColumn } from "./CompanyTableColumns/VehicleReportColumn";

export function CompanyReports() {
  const [searchParam, setSearchParam] = useSearchParams();
  setSearchParam;
  const [searchVal, setSearchVal] = useState("");
  const reportKeys = [
    "crExpiry",
    "RuksaExpiry",
    "cardexpireDate",
    "expiryDate",
  ];
  const datas = [];
  return (
    <main className="w-full h-full bg-white rounded-md p-2">
      <div className="w-full">
        <div className="w-full flex justify-between md:flex-row flex-col gap-2 ">
          <h1 className="text-2xl font-semibold">
            {companyReportHeading[searchParam.get("report")]
              ? companyReportHeading[searchParam.get("report")]
              : "Company Reports"}
          </h1>
          <Input
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            className="w-[300px] bg-white shadow-md"
            placeholder={`Search by ${
              searchParam.get("report") !== "expiryDate" &&
              reportKeys.includes(searchParam.get("report"))
                ? "Company Name"
                : "Vehicle Name"
            }`}
          />
          <Select onValueChange={(v) => console.log(v)}>
            <SelectTrigger className="md:w-[180px] w-full border-gray-300">
              <SelectValue
                placeholder={
                  searchParam.get("report") && searchParam.get("report") !== ""
                    ? searchParam.get("report")
                    : "Select Report by "
                }
              />
            </SelectTrigger>
            <SelectContent>
              {companyReportKeys?.map((val, I) => (
                <SelectItem key={val + "" + I} value={val}>
                  {companyReportHeading[val]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          {reportKeys.includes(searchParam.get("report")) &&
          searchParam.get("report") !== "expiryDate" ? (
            <>
              {datas && (
                <>
                  <EmployeeCompanyCommonTable
                    data={datas}
                    columns={companyColumn}
                  />
                </>
              )}
            </>
          ) : searchParam.get("report") == "expiryDate" ? (
            <>
              {datas && (
                <>
                  <EmployeeCompanyCommonTable
                    data={datas}
                    columns={vehicleReportColumn}
                  />
                </>
              )}
            </>
          ) : (
            <></>
          )}
        </div>
        {/* <div>
          {/expiry/i.test(searchParam.get("report")) ? (
            <>
              {datas && (
                <>
                </>
              )}
            </>
          ) : (
            <div className="w-full ">
              {datas &&
                datas?.map((emp, index) => (
                  <>
                    {emp && emp?.employees && (
                      <div className="w-full flex flex-col gap-1">
                        <DataTable
                          key={index}
                          data={emp.employees}
                          columns={reportColumn}
                          from="nested"
                          heading={emp[searchParam.get("report")]}
                        />
                      </div>
                    )}
                  </>
                ))}
            </div>
          )}
        </div> */}
      </div>
    </main>
  );
}
