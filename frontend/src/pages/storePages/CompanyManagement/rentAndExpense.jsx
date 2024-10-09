import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InputWithLabel } from "@/components/ui/InputWithLabel";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { EmployeeCompanyCommonTable } from "../EmployeeManagment/Components/EmployeListTable";
import { rentAndExpenseColumn } from "./CompanyTableColumns/RentandexpenseColumn";
import { Trash2 } from "lucide-react";

export function RentandExpense() {
  const handleRentExpenseAdd = () => {};
  const [image, setImage] = useState(undefined);
  const [rent, setRent] = useState("");
  const [remarks, setRemarks] = useState(undefined);
  const [rentExpense, setRentExpense] = useState(undefined);
  const [startingDate, setStartingDate] = useState(undefined);
  const [endingDate, setEndingDate] = useState(undefined);
  const datas = [];
  return (
    <main className="w-full h-full bg-white rounded-md p-2">
      <div className="w-full">
        <div className="w-full border rounded-xl p-4 shadow-md bg-slate-50">
          <div className="w-full">
            <h1 className="font-semibold text-[20px]">Add Rent and expense</h1>
          </div>
          <form className="w-full" onSubmit={handleRentExpenseAdd}>
            <div className="w-full grid grid-cols-1 lg:grid-cols-7 mt-2 gap-4">
              <input
                type="file"
                onChange={(e) => {
                  setImage(e.target.files[0]);
                  // form.trigger("image");
                }}
                id="image"
                name="image"
                className="hidden"
              />
              <label
                htmlFor="image"
                className="w-full cursor-pointer lg:col-span-2  h-48 border relative rounded-md bg-white flex justify-center items-center "
              >
                {image ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setImage(undefined)}
                      className="p-2 absolute top-3 right-3 rounded-md flex justify-center items-center bg-gray-500 text-white"
                    >
                      <Trash2 className="w-4" />
                    </button>
                    <img
                      className="h-full w-full object-cover"
                      src={
                        typeof image == "string"
                          ? image
                          : URL.createObjectURL(image)
                      }
                      alt=""
                    />
                  </>
                ) : (
                  <>
                    <span className="text-sm font-semibold text-center">
                      Click and Upload rent image
                    </span>
                  </>
                )}
              </label>
              <div className="lg:col-span-5  ">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <InputWithLabel
                    setValue={setRent}
                    placholder={"Enter rent eg: shop"}
                    label={"Enter rent"}
                    value={rent}
                    // watchKey={"rent"}
                  />
                  <InputWithLabel
                    setValue={setRemarks}
                    value={remarks}
                    placholder={"Enter remarks"}
                    label={"Enter remark"}
                    watchKey={"remarks"}
                  />
                </div>
                <div className="grid grid-col-1 lg:grid-cols-3 gap-4 mt-5">
                  <InputWithLabel
                    setValue={setRentExpense}
                    placholder={"Enter expense amount"}
                    label={"Enter expense"}
                    type="number"
                    value={rentExpense}
                    accept="number"
                    min={1}
                  />
                  <div className="flex flex-col gap-1">
                    <label htmlFor="" className="text-sm">
                      rent start date
                    </label>
                    <Input
                      value={startingDate?.toISOString().split("T")[0] || ""}
                      onChange={(e) => {
                        setStartingDate(new Date(e.target.value));
                      }}
                      type={"date"}
                      className={cn("w-full bg-white")}
                      placeholder={"amc contract start date"}
                    />
                    {/* <span className="text-[13px] text-red-500 min-h-5">
                      {form.formState.errors &&
                        form.formState.errors["startingDate"] &&
                        form.formState.errors["startingDate"].message}
                    </span> */}
                  </div>
                  <div className="flex flex-col gap-1">
                    <label htmlFor="" className="text-sm">
                      rent end date
                    </label>
                    <Input
                      value={endingDate?.toISOString().split("T")[0] || ""}
                      onChange={(e) => {
                        setEndingDate(new Date(e.target.value));
                      }}
                      type={"date"}
                      className={cn("w-full bg-white")}
                      placeholder={"amc contract start date"}
                    />
                    {/* <span className="text-[13px] text-red-500 min-h-5">
                      {form.formState.errors &&
                        form.formState.errors["endingDate"] &&
                        form.formState.errors["endingDate"].message}
                    </span> */}
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full flex justify-end">
              <Button type={"submit"}>Submit</Button>
            </div>
          </form>
        </div>
        <div>
          <EmployeeCompanyCommonTable
            columns={rentAndExpenseColumn}
            data={datas ? datas : []}
          />
        </div>
      </div>
    </main>
  );
}
