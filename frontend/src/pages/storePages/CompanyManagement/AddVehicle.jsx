import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InputWithLabel } from "@/components/ui/InputWithLabel";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

export function AddVehicle() {
  const handleAddVehicle = function () {};
  const [vehicleName, setVehicleName] = useState("");
  const [vehicleNo, setVehicleNo] = useState("");
  const [expiryDate, setExpiryDate] = useState(undefined);
  const [shopName, setShopName] = useState("");
  const [ownerId, setOwnerId] = useState("");
  const [companies, setCompanies] = useState([]);
  const [company, setCompany] = useState("");
  company;
  setCompanies;
  return (
    <main className="w-full h-full bg-white rounded-md p-2">
      <section className="w-full p-2 flex justify-center">
        <div className="w-full mx-auto p-5 min-h-56 shadow-md rounded-md border">
          <div className="w-full border-b pb-3">
            <h1 className="font-semibold text-2xl">Add Vehicle</h1>
          </div>
          <form className="w-full mt-3" onSubmit={handleAddVehicle}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
              <InputWithLabel
                label={"Vehicle name"}
                placholder={"enter vehicle name"}
                value={vehicleName}
                setValue={setVehicleName}
              />
              <InputWithLabel
                label={"Vehicle No."}
                placholder={"enter vehicle number"}
                setValue={setVehicleNo}
                value={vehicleNo}
              />
              <div className="flex flex-col gap-1">
                <label htmlFor="" className="text-sm">
                  Vehicle expiry date
                </label>
                <Input
                  value={expiryDate?.toISOString().split("T")[0] || ""}
                  onChange={(e) => {
                    setExpiryDate(new Date(e.target.value));
                    // trigger("expiryDate");
                  }}
                  placeholder="Select date here"
                  type={"date"}
                  className="w-full bg-white"
                />
                {/* <span className="text-[13px] text-red-500 min-h-5">
                  {errors &&
                    errors["expiryDate"] &&
                    errors["expiryDate"].message}
                </span> */}
              </div>
            </div>
            <div className="grid grid-col-1 lg:grid-cols-3 gap-5 mt-4">
              <InputWithLabel
                label={"Shop name"}
                placholder={"Enter shop name"}
                value={shopName}
                setValue={setShopName}
              />
              <InputWithLabel
                label={"Owner Id"}
                placholder={"Enter owner id"}
                value={ownerId}
                setValue={setOwnerId}
              />
              <div className="flex flex-col gap-1">
                <label htmlFor="" className="text-sm">
                  Select company
                </label>
                <Select
                  onValueChange={(value) => {
                    setCompany(value);
                  }}
                >
                  <SelectTrigger className="w-full bg-white">
                    <SelectValue placeholder="Select Company" />
                  </SelectTrigger>
                  <SelectContent>
                    {companies?.map((company) => (
                      <SelectItem
                        key={String(company?._id)}
                        value={String(company?._id)}
                      >
                        {company?.companyName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {/* <span className="text-[13px] text-red-500 min-h-5">
                  {errors && errors["company"] && errors["company"].message}
                </span> */}
              </div>
            </div>
            {/* <div className="grid grid-col-1 lg:grid-cols-2 gap-5">
              <InputWithLabel
                label={"Vehicle maintance"}
                placholder={"Vehicle maintance eg: oil change"}
                watch={watch}
                trigger={trigger}
                error={errors}
                setValue={setValue}
                watchKey={"maintenance"}
              />
              <InputWithLabel
                label={"Maintenance cost"}
                placholder={"Enter maintenance cost"}
                watch={watch}
                trigger={trigger}
                error={errors}
                setValue={setValue}
                watchKey={"maintanceCost"}
              />
            </div> */}

            {/* <div className="w-full border rounded-md p-2">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-2">
                <Input
                  value={maintanceTxt}
                  onChange={(e) => setMaintanceTxt(e.target.value)}
                  className="w-full col-span-4 bg-white"
                  placeholder="maintenance or expense"
                />
                <Input
                  className="w-full col-span-4 bg-white"
                  placeholder="cost"
                  value={maintanceCost}
                  onChange={(e) => setMaintanceCost(e.target.value)}
                />
                <Input
                  type="date"
                  value={maintanceDate?.toISOString().split("T")[0] || ""}
                  onChange={(e) => setMaintanceDate(new Date(e.target.value))}
                  className="w-full col-span-3 bg-white"
                />
                <Button
                  className="col-span-1 w-full"
                  onClick={handleMaintanceAdd}
                  type="button"
                >
                  Add
                </Button>
              </div>
              <div className="w-full border max-h-[300px] mt-2 p-2 rounded-md space-y-2">
                {watch("maintenances")?.map((item, Id) => (
                  // cost: maintanceCost, date: maintanceDate, maintenance: maintanceTxt
                  <div
                    key={Id}
                    className="w-full min-h-9 bg-slate-200 rounded-md pr-4 flex flex-wrap p-1 flex-row gap-2 relative"
                  >
                    <div className="min-h-8 py-1 px-2 rounded-md text-sm bg-white">
                      {item?.maintenance}
                    </div>
                    <div className="min-h-8 py-1 px-2 rounded-md text-sm bg-white">
                      {" "}
                      {item?.cost}
                    </div>
                    <div className="min-h-8 py-1 px-2 rounded-md text-sm bg-white">
                      {" "}
                      {item?.date && format(String(item?.date), "PPP")}
                    </div>
                    <X
                      className="w-4 absolute right-2 top-2 cursor-pointer"
                      onClick={() =>
                        setValue(
                          "maintenances",
                          getValues("maintenances")?.filter((_, I) => I !== Id)
                        )
                      }
                    />
                  </div>
                ))}
              </div>
              <span className="text-sm text-red-600">
                {errors && errors.maintenances && errors?.maintenances?.message}
              </span>
            </div> */}
            <div className="w-full flex mt-4 justify-end">
              <Button type={"submit"}>Submit</Button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}
