import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InputWithLabel } from "@/components/ui/InputWithLabel";
import { cn } from "@/lib/utils";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { EmployeeCompanyCommonTable } from "../EmployeeManagment/Components/EmployeListTable";
import { fireandCertificationColumn } from "./CompanyTableColumns/FireandcertificationColumn";

export function FireAndCertfication() {
  const handleFireCertificationAdd = () => {};
  const [fireCertificationImage, setFireCertificationImage] =
    useState(undefined);
  const [amcContractImage, setAmcContractImage] = useState(undefined);
  const [remarks, setRemarks] = useState("");
  const [amcContractStart, setAmcContractStart] = useState(undefined);
  const [amcContractEnd, setAmcContractEnd] = useState(undefined);
  const [amcRemarks, setAmcRemarks] = useState("");
  const datas = [];
  return (
    <main className="w-full h-full  rounded-md p-2">
      <div className="w-full">
        <div className="w-full border rounded-none p-4 shadow-md bg-gray-50">
          <div className="w-full">
            <h1 className="font-semibold text-[20px]">
              Add Fire and certification
            </h1>
          </div>
          <form
            onSubmit={handleFireCertificationAdd}
            action=""
            className="w-full mt-3"
          >
            <div className="w-full grid gird-cols-1 md:grid-cols-2 gap-5">
              <input
                type="file"
                className="hidden"
                id="fireCertificationImage"
                name="fireCertificationImage"
                onChange={(e) => {
                  setFireCertificationImage(e.target.files[0]);
                  // form.trigger("fireCertificationImage");
                }}
              />
              <label
                htmlFor="fireCertificationImage"
                className="w-full h-56 border rounded-md flex justify-center items-center bg-white cursor-pointer relative"
              >
                {fireCertificationImage ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setFireCertificationImage(undefined)}
                      className="absolute right-4 top-4 p-3 flex justify-center items-center rounded-md bg-gray-500 text-white"
                    >
                      <Trash2 className="w-5" />
                    </button>
                    <img
                      src={
                        typeof fireCertificationImage !== "string"
                          ? URL.createObjectURL(fireCertificationImage)
                          : fireCertificationImage
                      }
                      className="w-full h-full object-cover"
                      alt=""
                    />
                  </>
                ) : (
                  <>
                    <span className="text-sm font-semibold text-center">
                      Click and Upload Fire and certification image
                    </span>
                  </>
                )}
              </label>
              <input
                type="file"
                className="hidden"
                id="amcContractImage"
                name="amcContractImage"
                onChange={(e) => {
                  setAmcContractImage(e.target.files[0]);
                  // form.trigger("amcContractImage");
                }}
              />
              <label
                htmlFor="amcContractImage"
                className="w-full h-56 border rounded-md relative flex justify-center items-center bg-white cursor-pointer"
              >
                {amcContractImage ? (
                  <>
                    <button
                      onClick={() => setAmcContractImage(undefined)}
                      className="absolute right-4 top-4 p-3 flex justify-center items-center rounded-md bg-gray-500 text-white"
                    >
                      <Trash2 className="w-5" />
                    </button>
                    <img
                      src={
                        typeof amcContractImage !== "string"
                          ? URL.createObjectURL(amcContractImage)
                          : amcContractImage
                      }
                      className="w-full h-full object-cover"
                      alt=""
                    />
                  </>
                ) : (
                  <>
                    <span className="text-sm font-semibold text-center">
                      Click and Upload amc contract Image
                    </span>
                  </>
                )}
              </label>
            </div>
            <div className="w-full mt-4 gap-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
              <InputWithLabel
                label={"Enter fire and contract remark"}
                setValue={setRemarks}
                value={remarks}
                placholder={"Enter frc remark"}
              />
              <div className="flex flex-col gap-1">
                <label htmlFor="" className="text-sm">
                  Amc contract start date
                </label>
                <Input
                  value={amcContractStart?.toISOString().split("T")[0] || ""}
                  onChange={(e) => {
                    setAmcContractStart(new Date(e.target.value));
                    // form.trigger("amcContractStart");
                  }}
                  type={"date"}
                  className={cn("w-full bg-white")}
                  placeholder={"amc contract start date"}
                />
                {/* <span className="text-[13px] text-red-500 min-h-5">
                  {form.formState.errors &&
                    form.formState.errors["amcContractStart"] &&
                    form.formState.errors["amcContractStart"].message}
                </span> */}
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="" className="text-sm">
                  Amc contract end date
                </label>
                <Input
                  value={amcContractEnd?.toISOString().split("T")[0] || ""}
                  onChange={(e) => {
                    setAmcContractEnd(new Date(e.target.value));
                    // form.trigger("amcContractEnd");
                  }}
                  type={"date"}
                  className={cn("w-full bg-white")}
                  placeholder={"amc contract start date"}
                />
                {/* <span className="text-[13px] text-red-500 min-h-5">
                  {form.formState.errors &&
                    form.formState.errors["amcContractEnd"] &&
                    form.formState.errors["amcContractEnd"].message}
                </span> */}
              </div>
              <InputWithLabel
                label={"Enter amc  contract remark"}
                setValue={setAmcRemarks}
                value={amcRemarks}
                placholder={"Enter amc remark"}
              />
            </div>
            <div className="w-full flex justify-end mt-4">
              <Button type={"submit"}>Submit</Button>
            </div>
          </form>
        </div>
        <div>
          <EmployeeCompanyCommonTable
            columns={fireandCertificationColumn}
            data={datas ? datas : []}
          />
        </div>
      </div>
    </main>
  );
}
