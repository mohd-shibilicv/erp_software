import { Button } from "@/components/ui/button";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from "@/components/ui/select";
import {
  reportHeadings,
  reportQueryKeys,
} from "@/constants/employeeMngmentrelatesd";
// import { SelectContent } from "@radix-ui/react-select";
import { Input } from "postcss";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { passportReportColumn } from "./TableColumns/passPortColumn";
import { contractExpiryReportColumn } from "./TableColumns/contractExpiryColumn";
import { vpExpiryReportColumn } from "./TableColumns/visExpiryColumn";
import { gatePassExpiryReportColumn } from "./TableColumns/gatePassExpiryReport";
import { medicalExpiryReportColumn } from "./TableColumns/medicalExpiryReport";
import { ppExpiryReportColumn } from "./TableColumns/ppExpiryColumn";
import { idExpiryReportColumn } from "./TableColumns/idExpiryColumns";
import { reportColumn } from "./TableColumns/reportColumn";
import { EmployeeCompanyCommonTable } from "./Components/EmployeListTable";

export default function Reports() {
  const [searchParam, setSearchParam] = useSearchParams();
  const [secondarySearch, setSeondarySearch] = useState("");
  const [searchVal, setSearchVal] = useState("");
  const [datas, setDatas] = useState(null);
  setSearchParam;
  setDatas;
  return (
    <main className="w-full h-full bg-white rounded-md p-2">
      <div className="w-full">
        <div className="w-full flex justify-between md:flex-row flex-col gap-2">
          <h1 className="text-2xl font-semibold">
            Report by {reportHeadings[searchParam.get("report")]}
          </h1>
          {(searchParam.get("report") == "nation" ||
            searchParam.get("report") == "workBranch") && (
            <>
              <Input
                value={secondarySearch}
                onChange={(e) => setSeondarySearch(e.target.value)}
                className={`w-[300px] shadow-md bg-white `}
                placeholder={`Search ${searchParam.get("report")}`}
              />
            </>
          )}
          {searchParam.get("report") == "designation" && (
            <>
              <div className="flex items-center gap-2">
                <Input
                  value={searchVal}
                  onChange={(e) => setSearchVal(e.target.value)}
                  placeholder={`Search designation`}
                />
                <Button>Search</Button>
              </div>
            </>
          )}
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
              {reportQueryKeys?.map((val, I) => (
                <SelectItem key={val + "" + I} value={val}>
                  {val == "visExpiry"
                    ? "ID Expiry"
                    : val == "ppExpiry"
                    ? "Passport expiry"
                    : val}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          {/expiry/i.test(searchParam.get("report")) ||
          searchParam.get("report") == "passportOut" ||
          searchParam.get("report") == "passportIN" ? (
            <>
              <>
                <EmployeeCompanyCommonTable
                  from="employeeRpt"
                  data={datas ? datas : []}
                  columns={
                    searchParam.get("report") == "passportOut"
                      ? passportReportColumn
                      : searchParam.get("report") == "passportIN"
                      ? passportReportColumn
                      : searchParam.get("report") == "contractExpiry"
                      ? contractExpiryReportColumn
                      : searchParam.get("report") == "vpExpiry"
                      ? vpExpiryReportColumn
                      : searchParam.get("report") == "gatePassExpiry"
                      ? gatePassExpiryReportColumn
                      : searchParam.get("report") == "medicalExpiry"
                      ? medicalExpiryReportColumn
                      : searchParam.get("report") == "ppExpiry"
                      ? ppExpiryReportColumn
                      : searchParam.get("report") == "visExpiry"
                      ? idExpiryReportColumn
                      : reportColumn
                  }
                />
              </>
            </>
          ) : (
            <div className="w-full ">
              {datas &&
                datas?.map((emp, index) => (
                  <>
                    {emp && emp?.employees && (
                      <div className="w-full flex flex-col gap-1">
                        <EmployeeCompanyCommonTable
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
        </div>
      </div>
    </main>
  );
}
