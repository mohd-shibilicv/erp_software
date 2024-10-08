import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InputWithLabel } from "@/components/ui/InputWithLabel";
import { UploadIcon, X } from "lucide-react";
import { useState } from "react";

export function AddCompany() {
  const handleCompanyAdd = function () {};
  const [companyName, setCompanyName] = useState("");
  const [crNo, setCrNo] = useState("");
  const [crExpiry, setCrExpiry] = useState(undefined);
  const [RuksaNo, setRuksaNo] = useState("");
  const [RuksaExpiry, setRuksaExpiry] = useState(undefined);
  const [computerCard, setComputerCard] = useState("");
  const [cardexpireDate, setCardExpireDate] = useState(undefined);
  const [crImage, setCrImage] = useState(undefined);
  const [RuksImage, setRuksImage] = useState(undefined);
  const [computerCardImage, setComputerCardImage] = useState(undefined);
  return (
    <main className="w-full h-full bg-white rounded-md p-2">
      <section className="w-full p-2 flex justify-center">
        <div className="w-full mx-auto p-5 min-h-64 shadow-md rounded-md border">
          <div className="w-full border-b pb-3">
            <h1 className="font-semibold text-2xl">Add Company</h1>
          </div>
          <form className="w-full mt-3" onSubmit={handleCompanyAdd}>
            <div className="w-full grid grid-cols-1 lg:grid-cols-4 gap-2">
              <InputWithLabel
                // error={errors}
                label={"Company name"}
                placholder={"Enter company name"}
                setValue={setCompanyName}
                value={companyName}
                // trigger={trigger}
                // watch={watch}
                // watchKey={"companyName"}
              />
              <InputWithLabel
                // error={errors}
                label={"Cr NO"}
                placholder={"Enter cr number"}
                setValue={setCrNo}
                value={crNo}
                // trigger={trigger}
                // watch={watch}
                // watchKey={"crNo"}
              />
              <div className="flex flex-col gap-1">
                <label htmlFor="" className="text-sm">
                  Cr expiry
                </label>
                <Input
                  value={crExpiry?.toISOString().split("T")[0] || ""}
                  onChange={(e) => {
                    setCrExpiry(new Date(e.target.value));
                    // trigger("crExpiry");
                  }}
                  type={"date"}
                  className="w-full bg-white"
                />
                {/* <span className="text-[13px] text-red-500 min-h-5">
                  {errors && errors["crExpiry"] && errors["crExpiry"].message}
                </span> */}
              </div>
              <InputWithLabel
                // error={errors}
                label={"Ruksa number"}
                placholder={"Enter Ruksa number"}
                setValue={setRuksaNo}
                value={RuksaNo}
                // trigger={trigger}
                // watch={watch}
                // watchKey={"RuksaNo"}
              />
            </div>
            <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-5 mt-4">
              <div className="flex flex-col gap-1">
                <label htmlFor="" className="text-sm">
                  Ruksa expiry
                </label>
                <Input
                  value={RuksaExpiry?.toISOString().split("T")[0] || ""}
                  onChange={(e) => {
                    setRuksaExpiry(new Date(e.target.value));
                    // trigger("RuksaExpiry");
                  }}
                  type={"date"}
                  className="w-full bg-white"
                />
                {/* <span className="text-[13px] text-red-500 min-h-5">
                  {errors &&
                    errors["RuksaExpiry"] &&
                    errors["RuksaExpiry"].message}
                </span> */}
              </div>
              <InputWithLabel
                label={"Computer Card"}
                placholder={"computer card"}
                // error={errors}
                // trigger={trigger}
                // watch={watch}
                value={computerCard}
                watchKey={"computerCard"}
                setValue={setComputerCard}
              />
              <div className="flex flex-col gap-1">
                <label htmlFor="" className="text-sm">
                  Computer card expiry
                </label>
                <Input
                  value={cardexpireDate?.toISOString().split("T")[0] || ""}
                  onChange={(e) => {
                    setCardExpireDate(new Date(e.target.value));
                    // trigger("cardexpireDate");
                  }}
                  type={"date"}
                  className="w-full bg-white"
                />
                {/* <span className="text-[13px] text-red-500 min-h-5">
                  {errors &&
                    errors["cardexpireDate"] &&
                    errors["cardexpireDate"].message}
                </span> */}
              </div>
            </div>
            <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
              <div className="flex flex-col gap-1">
                <input
                  type="file"
                  id="crImage"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => setCrImage(e.target.files[0])}
                />
                <label
                  htmlFor="crImage"
                  className="w-full h-48 rounded-md border bg-white/90 flex flex-col gap-2 cursor-pointer justify-center items-center"
                >
                  {crImage ? (
                    <div className="w-full h-full relative">
                      <X
                        className="w-4 absolute right-2 top-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          setCrImage(undefined);
                        }}
                      />
                      <img
                        src={
                          typeof crImage == "string"
                            ? crImage
                            : URL.createObjectURL(crImage)
                        }
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <>
                      <UploadIcon className="w-5" />
                      <h4 className="text-sm">Click and Upload cr image</h4>
                    </>
                  )}
                </label>
                {/* <span className="text-[13px] text-red-600 h-4">
                  {errors && errors.crImage && errors.crImage.message}
                </span> */}
              </div>
              <div className="flex flex-col gap-1">
                <input
                  type="file"
                  id="RuksImage"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => setRuksImage(e.target.files[0])}
                />
                <label
                  htmlFor="RuksImage"
                  className="w-full h-48 rounded-md border bg-white/90 flex flex-col gap-2 cursor-pointer justify-center items-center"
                >
                  {RuksImage ? (
                    <div className="w-full h-full relative">
                      <X
                        className="w-4 absolute right-2 top-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          setRuksImage(undefined);
                        }}
                      />
                      <img
                        src={
                          typeof RuksImage == "string"
                            ? RuksImage
                            : URL.createObjectURL(RuksImage)
                        }
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <>
                      <UploadIcon className="w-5" />
                      <h4 className="text-sm">Click and Upload Ruksa image</h4>
                    </>
                  )}
                </label>
                {/* <span className="text-[13px] text-red-600 h-4">
                  {errors && errors.RuksImage && errors.RuksImage.message}
                </span> */}
              </div>
              <div className="flex flex-col gap-1">
                <input
                  type="file"
                  id="computerCardImage"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => setComputerCardImage(e.target.files[0])}
                />
                <label
                  htmlFor="computerCardImage"
                  className="w-full h-48 rounded-md border bg-white/90 flex flex-col gap-2 cursor-pointer justify-center items-center"
                >
                  {computerCardImage ? (
                    <div className="w-full h-full relative">
                      <X
                        className="w-4 absolute right-2 top-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          setComputerCardImage(undefined);
                        }}
                      />
                      <img
                        src={
                          typeof computerCardImage == "string"
                            ? computerCardImage
                            : URL.createObjectURL(computerCardImage)
                        }
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <>
                      <UploadIcon className="w-5" />
                      <h4 className="text-sm">Upload computer card image</h4>
                    </>
                  )}
                </label>
                {/* <span className="text-[13px] text-red-600 h-4">
                  {errors &&
                    errors.computerCardImage &&
                    errors.computerCardImage.message}
                </span> */}
              </div>
            </div>
            <div className="w-full flex justify-end mt-4">
              <Button type={"submit"}>Submit</Button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}
