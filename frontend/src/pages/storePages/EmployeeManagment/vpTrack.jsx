import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectValue,SelectTrigger
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
// import { SelectTrigger } from "@radix-ui/react-select";
import { Check, ChevronsUpDown } from "lucide-react";
import { useState } from "react";
import { EmployeeCompanyCommonTable } from "./Components/EmployeListTable";
import { format } from "date-fns";

export default function VpTrack() {
  const handleVpTrackAdd = () => {};
  const [company, setCompany] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("");
  const [companies, setCompanies] = useState([]);
  const [nation, setNation] = useState("");
  const [nationBoxOpen, setNationBoxOpen] = useState(false);
  const [vpNo, setVpNo] = useState("");
  const [vpNumbers, setVpNumbers] = useState([]);
  setCompanies;
  company;
  setVpNumbers;
  const [vpExpiry, setVpExpiry] = useState(undefined);
  const [employeeDesignation, setEmployeeDesignation] = useState("");
  const [visaCount, setVisaCount] = useState();
  return (
    <main className="w-full h-full bg-white rounded-md p-2">
      <div className="w-full">
        <div className="w-full border rounded-xl p-4 shadow-md ">
          <div className="w-full">
            <h1 className="font-semibold text-[20px]">Add Vp tracking</h1>
          </div>
          <form action="" className="w-full mt-3" onSubmit={handleVpTrackAdd}>
            <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="flex flex-col gap-1">
                <label htmlFor="" className="text-sm">
                  Select Company
                </label>
                <Select
                  onValueChange={(value) => {
                    setCompany(value);
                    // trigger("company");
                    setSelectedCompany(companies?.find((c) => c?._id == value));
                  }}
                >
                  <SelectTrigger className="w-full bg-white">
                    <SelectValue placeholder="Select Company" />
                  </SelectTrigger>
                  <SelectContent>
                    {companies?.map((company) => (
                      <SelectItem
                        key={String(company._id)}
                        value={String(company._id)}
                      >
                        {company?.companyName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {/* <span className="text-[13px] text-red-500 min-h-5">
                  {errors && errors.company && errors.company.message}
                </span> */}
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="" className="text-sm">
                  Computer Card
                </label>
                <Input
                  value={
                    selectedCompany?.computerCard
                      ? selectedCompany?.computerCard
                      : "Nill"
                  }
                  placeholder="computer card"
                  className="pointer-events-none bg-white"
                />
                <span className="h-4"></span>
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="" className="text-sm">
                  Nation
                </label>
                <Popover open={nationBoxOpen} onOpenChange={setNationBoxOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={open}
                      className="w-full justify-between"
                    >
                      {nation
                        ? ["India", "pack"].find(
                            (framework) => framework === nation
                          )?.label
                        : "Select framework..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0">
                    <Command>
                      <CommandInput placeholder="Search framework..." />
                      <CommandList>
                        <CommandEmpty>No framework found.</CommandEmpty>
                        <CommandGroup>
                          {["India", "Pak"].map((framework) => (
                            <CommandItem
                              key={framework}
                              value={framework}
                              onSelect={(currentValue) => {
                                setNation(
                                  currentValue === nation ? "" : currentValue
                                );
                                setNationBoxOpen(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  nation === framework.value
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {framework.label}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                {/* <span className="text-[13px] text-red-500 min-h-5">
                  {errors && errors.nationality && errors.nationality.message}
                </span> */}
              </div>
            </div>
            <div className="mt-3 grid grid-cols-1 md:grid-cols-4 gap-3">
              <div className="flex flex-col gap-1">
                <label htmlFor="" className="text-sm">
                  Enter Vp No
                </label>
                <input
                  list="vpnumbers"
                  id="vpnumber-input"
                  value={vpNo ? vpNo : ""}
                  onChange={(e) => {
                    setVpNo(e.target.value);
                    // trigger("vpNo");
                  }}
                  placeholder="Vp No"
                  className="rounded-md px-3 border h-9 text-sm"
                />
                <datalist id="vpnumbers">
                  {vpNumbers.map((val, id) => (
                    <option key={id}>{val}</option>
                  ))}
                </datalist>
                {/* <span className="text-[13px] text-red-500 min-h-5">
                  {errors && errors.vpNo && errors.vpNo.message}
                </span> */}
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="" className="text-sm">
                  VP Expiry
                </label>
                <Input
                  value={vpExpiry?.toISOString().split("T")[0] || ""}
                  onChange={(e) => {
                    setVpExpiry(new Date(e.target.value));
                    // trigger("vpExpiry");
                  }}
                  type="date"
                  className="w-full bg-white"
                  placeholder="vp expiry"
                />
                {/* <span className="text-[13px] text-red-500 min-h-5">
                  {errors && errors.vpExpiry && errors.vpExpiry.message}
                </span> */}
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="" className="text-sm">
                  Employee Desgination
                </label>
                <Input
                  value={employeeDesignation ? employeeDesignation : ""}
                  onChange={(e) => {
                    setEmployeeDesignation(e.target.value);
                    // trigger("employeeDesignation");
                  }}
                  type="text"
                  className="w-full bg-white"
                  placeholder="Employee designation"
                />
                {/* <span className="text-[13px] text-red-500 min-h-5">
                  {errors &&
                    errors.employeeDesignation &&
                    errors.employeeDesignation.message}
                </span> */}
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="" className="text-sm">
                  Visa Count
                </label>
                <Input
                  accept="numbers"
                  value={visaCount ? visaCount : ""}
                  onChange={(e) => {
                    setVisaCount(Number(e.target.value));
                    // trigger("visaCount");
                  }}
                  type="number"
                  className="w-full bg-white"
                  placeholder="Employee designation"
                />
                {/* <span className="text-[13px] text-red-500 min-h-5">
                  {errors && errors.visaCount && errors.visaCount.message}
                </span> */}
              </div>
            </div>
            <div className="mt-3 flex justify-end">
              <Button type={"submit"}>Submit</Button>
            </div>
          </form>
        </div>

        <>
          <EmployeeCompanyCommonTable
            columns={[
              {
                accessorKey: "vpNo",
                header: () => <div className="font-semibold">Vp No</div>,
              },
              {
                accessorKey: "nationality",
                header: () => <div className="font-semibold">Nationality</div>,
                cell: ({ row }) => <div>{row.getValue("nationality")}</div>,
              },
              {
                accessorKey: "vpExpiry",
                header: () => (
                  <div className="font-semibold">Vp Expiry expiry</div>
                ),
                cell: ({ row }) => (
                  <div>
                    {!row.getValue("vpExpiry") && "Pending"}
                    {row.getValue("vpExpiry") &&
                      format(String(row.getValue("vpExpiry")), "PPP")}
                  </div>
                ),
              },
              {
                accessorKey: "employeeDesignation",
                header: () => <div className="font-semibold">Designation</div>,
                cell: ({ row }) => (
                  <div>{row.getValue("employeeDesignation")}</div>
                ),
              },
              {
                accessorKey: "visaCount",
                header: () => (
                  <div className="font-semibold">Visa Quantity</div>
                ),
                cell: ({ row }) => {
                  return <div>{row.getValue("visaCount")}</div>;
                },
              },
            ]}
            data={[]}
          />
        </>
      </div>
    </main>
  );
}
