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
import { InputWithLabel } from "@/components/ui/InputWithLabel";
import { Popover, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { PopoverContent } from "@radix-ui/react-popover";
import { format } from "date-fns";
import { Check, ChevronsUpDown, UploadIcon, X } from "lucide-react";
import { useState } from "react";

export default function AddEmployee() {
  const handleEmployeeAdd = function () {};
  const [image, setImage] = useState(undefined);
  const [slNo, setSlNo] = useState(undefined);
  const [filNo, setFIlNo] = useState(undefined);
  const [passportImage, setPassportImage] = useState(undefined);
  const [ppNo, setPpno] = useState(undefined);
  const [ppExpiry, setPpExpiry] = useState(undefined);
  const [idPhoto, setIdPhoto] = useState(undefined);
  const [idNo, setIdNo] = useState(undefined);
  const [visaExpiry, setVisaExpiry] = useState(undefined);
  const [name, setName] = useState(undefined);
  const [nationBoxOpen, setNationBoxOpen] = useState(false);
  const [nation, setNation] = useState("");
  const [company, setCompany] = useState(undefined);
  company;
  const [passportType, setPassportType] = useState("In");
  passportType;
  passportImage;
  const [designation, setDesignation] = useState("");
  const [contactNo, setContactNo] = useState("");
  const [workBranch, setWorkBranch] = useState("");
  const [address, setAddress] = useState("");
  const [vpNo, setVpNo] = useState(undefined);
  const [vpExpiry, setVpExpiry] = useState(undefined);
  const [email, setEmail] = useState("");
  const [contractExpiry, setContractExpiry] = useState(undefined);
  const [medicalExpiry, setMedicalExpiry] = useState(undefined);
  const [gatePassExpiry, setGatePassExpiry] = useState(undefined);
  const [joiningDate, setJoiningDate] = useState(undefined);
  const [arriveDate, setArriveDate] = useState(undefined);
  const [medicalPhoto, setMedicalPhoto] = useState(undefined);
  const [gatePassImage, setGatePassImage] = useState(undefined);
  const [contractImage, setContractImage] = useState(undefined);
  const [uniforms, setUniforms] = useState([]);
  const [uniformShirts, setUniformShirt] = useState();
  const [uniformPant, setUniformPant] = useState();
  const [uniformCap, setUniformCap] = useState();
  const [uniformShoe, setUniformShoe] = useState();
  const [uniformDate, setUniformDate] = useState();
  return (
    <main className="w-full h-full bg-white rounded-md p-2">
      <section className="w-full p-2 flex justify-center">
        <div className="w-full  mx-auto p-5 min-h-56 shadow-md rounded-md border bg-gray-100">
          <div className="w-full pb-4 flex items-start border-b border-gray-300">
            <h1 className="text-2xl font-semibold">Add new Employee</h1>
          </div>
          <form
            className="w-full flex flex-col mt-3 gap-3"
            onSubmit={handleEmployeeAdd}
          >
            <div className="w-full grid grid-cols-1 lg:grid-cols-7 min-h-36  gap-3 ">
              <input
                type="file"
                id="Img"
                className="hidden"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
              />
              <label
                htmlFor="Img"
                className="col-span-2 lg:h-full  h-56  flex justify-center items-center bg-white/90 flex-col gap-2 cursor-pointer "
              >
                {image ? (
                  <div className="w-full h-full relative">
                    <X
                      className="w-4 absolute right-2 top-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        setImage(undefined);
                      }}
                    />
                    <img
                      src={
                        typeof image == "string"
                          ? image
                          : URL.createObjectURL(image)
                      }
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <>
                    <UploadIcon className="w-5" />
                    <h4 className="text-sm text-center">
                      Click and Upload image
                    </h4>
                  </>
                )}
              </label>
              <div className="col-span-5 h-full  flex-col justify-between ">
                <InputWithLabel
                  label={"SL. No"}
                  // error={errors}
                  placholder={"sl no"}
                  setValue={setSlNo}
                  value={slNo}
                  // watch={watch}
                  // trigger={trigger}
                  // watchKey={"slNo"}
                />
                <div className="flex flex-col gap-1 ">
                  <label htmlFor="" className="text-sm">
                    File. No
                  </label>
                  <Input
                    value={filNo}
                    onChange={(e) => {
                      setFIlNo(e.target.value);
                      // trigger("filNo");
                    }}
                    className="w-full bg-white"
                    placeholder="file no"
                  />
                  {/* {errors && errors.filNo && (
                    <>
                      <span className="text-[13px] text-red-500 min-h-5">
                        {errors.filNo.message}
                      </span>
                    </>
                  )} */}
                </div>
              </div>
            </div>
            {/*  */}
            <div className="w-full grid grid-cols-1 lg:grid-cols-7 min-h-36  gap-3 ">
              <input
                type="file"
                id="passportImage"
                className="hidden"
                accept="image/*"
                onChange={(e) => setPassportImage(e.target.files[0])}
              />
              <label
                htmlFor="passportImage"
                className="col-span-2 lg:h-full  h-56  flex justify-center items-center bg-white/90 flex-col gap-2 cursor-pointer "
              >
                {passportImage ? (
                  <div className="w-full h-full relative">
                    <X
                      className="w-4 absolute right-2 top-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        setPassportImage(undefined);
                      }}
                    />
                    <img
                      src={
                        typeof passportImage == "string"
                          ? passportImage
                          : URL.createObjectURL(passportImage)
                      }
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <>
                    <UploadIcon className="w-5" />
                    <h4 className="text-sm">Click passportImage</h4>
                  </>
                )}
              </label>
              <div className="col-span-5 h-full  flex-col justify-between ">
                <InputWithLabel
                  label={"PP. NO"}
                  // error={errors}
                  placholder={"Passport number"}
                  setValue={setPpno}
                  value={ppNo}
                  // watch={watch}
                  // trigger={trigger}
                  // watchKey={"ppNo"}
                />
                <div className="flex flex-col gap-1">
                  <label htmlFor="" className="text-sm">
                    PP. Expiry
                  </label>
                  <Input
                    value={ppExpiry?.toISOString().split("T")[0] || ""}
                    onChange={(e) => {
                      setPpExpiry(new Date(e.target.value));
                      // trigger("ppExpiry");
                    }}
                    type="date"
                    className="w-full bg-white"
                    placeholder="employee passport expiry"
                  />
                  {/* {errors && errors.ppExpiry && (
                    <>
                      <span className="text-[13px] text-red-500 min-h-5">
                        {errors && errors.ppExpiry && errors.ppExpiry.message}
                      </span>
                    </>
                  )} */}
                </div>
              </div>
            </div>
            {/* Id*_ */}
            <div className="w-full grid grid-cols-1 lg:grid-cols-7 min-h-36  gap-3   ">
              <input
                type="file"
                id="idPhoto"
                className="hidden"
                accept="image/*"
                onChange={(e) => setIdPhoto(e.target.files[0])}
              />
              <label
                htmlFor="idPhoto"
                className="col-span-2 lg:h-full  h-56    flex justify-center items-center bg-white/90 flex-col gap-2 cursor-pointer "
              >
                {idPhoto ? (
                  <div className="w-full h-full relative">
                    <X
                      className="w-4 absolute right-2 top-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIdPhoto(undefined);
                      }}
                    />
                    <img
                      src={
                        typeof idPhoto == "string"
                          ? idPhoto
                          : URL.createObjectURL(idPhoto)
                      }
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <>
                    <UploadIcon className="w-5" />
                    <h4 className="text-sm">Upload id image</h4>
                  </>
                )}
              </label>
              <div className="col-span-5 h-full  flex-col justify-between ">
                <InputWithLabel
                  label={"Id number"}
                  // error={errors}
                  placholder={"id number"}
                  setValue={setIdNo}
                  value={idNo}
                  // watch={watch}
                  // trigger={trigger}
                  // watchKey={"idNo"}
                />
                <div className="flex flex-col gap-1">
                  <label htmlFor="" className="text-sm">
                    ID/Visa Expiry
                  </label>
                  <Input
                    value={visaExpiry?.toISOString().split("T")[0] || ""}
                    onChange={(e) => {
                      setVisaExpiry(new Date(e.target.value));
                      // trigger("visExpiry");
                    }}
                    type="date"
                    className="w-full bg-white"
                    placeholder="employee visa or id expiry"
                  />
                  {/* {errors && errors.visExpiry && (
                    <>
                      <span className="text-[13px] text-red-500 min-h-5">
                        {errors && errors.visExpiry && errors.visExpiry.message}
                      </span>
                    </>
                  )} */}
                </div>
              </div>
            </div>
            {/*  Id*/}
            <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-3">
              <InputWithLabel
                label={"Name"}
                // error={errors}
                value={name}
                placholder={"employee name"}
                setValue={setName}
                // watch={watch}
                // trigger={trigger}
                // watchKey={"name"}
              />

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
                  {errors && errors.nation && errors.nation.message}
                </span> */}
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="" className="text-sm">
                  Select Company
                </label>
                <Select
                  onValueChange={(value) => {
                    setCompany(value);
                    // trigger("company");
                  }}
                >
                  <SelectTrigger className="w-full bg-white">
                    <SelectValue placeholder="Choose company" />
                  </SelectTrigger>
                  <SelectContent>
                    {["companies", "asdf"]?.map((company, Idx) => (
                      <SelectItem key={Idx} value={company}>
                        {company}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="flex flex-col gap-1">
                <label htmlFor="" className="text-sm">
                  Select Passport Type
                </label>
                <Select
                  onValueChange={(value) => {
                    setPassportType(value);
                    // trigger("passportType");
                  }}
                >
                  <SelectTrigger className="w-full bg-white">
                    <SelectValue placeholder="Passport type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem key={"In"} value={"In"}>
                      In
                    </SelectItem>
                    <SelectItem key={"Out"} value={"Out"}>
                      Out
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="" className="text-sm">
                  Designation
                </label>
                <Input
                  value={designation}
                  onChange={(e) => {
                    setDesignation(e.target.value);
                    // trigger("designation");
                  }}
                  className="w-full bg-white"
                  placeholder="employee designation"
                />
                {/* <span className="text-[13px] text-red-500 min-h-5">
                  {errors && errors.designation && errors.designation.message}
                </span> */}
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="" className="text-sm">
                  Contact No
                </label>
                <Input
                  value={contactNo}
                  onChange={(e) => {
                    setContactNo(e.target.value);
                    // trigger("contactNo");
                  }}
                  className="w-full bg-white"
                  placeholder="employee contact"
                />
                {/* <span className="text-[13px] text-red-500 min-h-5">
                  {errors && errors.contactNo && errors.contactNo.message}
                </span> */}
              </div>
            </div>
            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label htmlFor="" className="text-sm">
                  Working shop/Branch
                </label>
                <Input
                  value={workBranch}
                  onChange={(e) => {
                    setWorkBranch(e.target.value);
                    // trigger("workBranch");
                  }}
                  className="w-full bg-white"
                  placeholder="employee work shop/branch"
                />
                {/* <span className="text-[13px] text-red-500 min-h-5">
                  {errors && errors.workBranch && errors.workBranch.message}
                </span> */}
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="" className="text-sm">
                  Home Address
                </label>
                <Input
                  value={address}
                  onChange={(e) => {
                    setAddress(e.target.value);
                    // trigger("address");
                  }}
                  className="w-full bg-white"
                  placeholder="Home address"
                />
                {/* <span className="text-[13px] text-red-500 min-h-5">
                  {errors && errors.address && errors.address.message}
                </span> */}
              </div>
            </div>
            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label htmlFor="" className="text-sm">
                  VP. NO
                </label>
                <Input
                  value={vpNo}
                  onChange={(e) => {
                    setVpNo(e.target.value);
                    // trigger("vpNo");
                  }}
                  className="w-full bg-white"
                  placeholder="employee VP number"
                />
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
                  placeholder="id or visa expiry"
                />
                {/* <span className="text-[13px] text-red-500 min-h-5">
                  {errors && errors.vpExpiry && errors.vpExpiry.message}
                </span> */}
              </div>
            </div>
            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label htmlFor="" className="text-sm">
                  Email
                </label>
                <Input
                  value={email ? email : ""}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    // trigger("email");
                  }}
                  className="w-full bg-white"
                  placeholder="employee address"
                />
                {/* <span className="text-[13px] text-red-500 min-h-5">
                  {errors && errors.email && errors.email.message}
                </span> */}
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="" className="text-sm">
                  Contract Expiry
                </label>
                <Input
                  value={
                    (contractExpiry &&
                      contractExpiry?.toISOString().split("T")[0]) ||
                    ""
                  }
                  onChange={(e) => {
                    setContractExpiry(new Date(e.target.value));
                    // trigger("contractExpiry");
                  }}
                  type="date"
                  className="w-full bg-white"
                  placeholder="contract expiry date"
                />
                {/* <span className="text-[13px] text-red-500 min-h-5">
                  {errors &&
                    errors.contractExpiry &&
                    errors.contractExpiry.message}
                </span> */}
              </div>
            </div>
            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label htmlFor="" className="text-sm">
                  Medical Expiry
                </label>
                <Input
                  value={medicalExpiry?.toISOString().split("T")[0] || ""}
                  onChange={(e) => {
                    setMedicalExpiry(new Date(e.target.value));
                    // trigger("medicalExpiry");
                  }}
                  type="date"
                  className="w-full bg-white"
                  placeholder="employee medical expiry"
                />
                {/* <span className="text-[13px] text-red-500 min-h-5">
                  {errors &&
                    errors.medicalExpiry &&
                    errors.medicalExpiry.message}
                </span> */}
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="" className="text-sm">
                  Gate pass expiry
                </label>
                <Input
                  value={gatePassExpiry?.toISOString().split("T")[0] || ""}
                  onChange={(e) => {
                    setGatePassExpiry(new Date(e.target.value));
                    // trigger("gatePassExpiry");
                  }}
                  type="date"
                  className="w-full bg-white"
                  placeholder="gate pass expiry"
                />
                {/* <span className="text-[13px] text-red-500 min-h-5">
                  {errors &&
                    errors.gatePassExpiry &&
                    errors.gatePassExpiry.message}
                </span> */}
              </div>
            </div>
            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label htmlFor="" className="text-sm">
                  Joining date
                </label>
                <Input
                  value={joiningDate?.toISOString().split("T")[0] || ""}
                  onChange={(e) => {
                    setJoiningDate(new Date(e.target.value));
                    // trigger("joiningDate");
                  }}
                  type="date"
                  className="w-full bg-white"
                  placeholder="employee medical expiry"
                />
                {/* <span className="text-[13px] text-red-500 min-h-5">
                  {errors && errors.joiningDate && errors.joiningDate.message}
                </span> */}
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="" className="text-sm">
                  Arrive Date
                </label>
                <Input
                  value={arriveDate?.toISOString().split("T")[0] || ""}
                  onChange={(e) => {
                    setArriveDate(new Date(e.target.value));
                    // trigger("arriveDate");
                  }}
                  type="date"
                  className="w-full bg-white"
                  placeholder="gate pass expiry"
                />
                {/* <span className="text-[13px] text-red-500 min-h-5">
                  {errors && errors.arriveDate && errors.arriveDate.message}
                </span> */}
              </div>
            </div>
            <div className="w-full grid gap-y-2 gap-x-3 grid-cols-1 lg:grid-cols-3  items-center">
              <div className="flex flex-col gap-1">
                <input
                  type="file"
                  id="medicalPhoto"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => setMedicalPhoto(e.target.files[0])}
                />
                <label
                  htmlFor="medicalPhoto"
                  className="w-full h-48 rounded-md border bg-white/90 flex flex-col gap-2 cursor-pointer justify-center items-center"
                >
                  {medicalPhoto ? (
                    <div className="w-full h-full relative">
                      <X
                        className="w-4 absolute right-2 top-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          setMedicalPhoto(undefined);
                        }}
                      />
                      <img
                        src={
                          typeof medicalPhoto == "string"
                            ? medicalPhoto
                            : URL.createObjectURL(medicalPhoto)
                        }
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <>
                      <UploadIcon className="w-5" />
                      <h4 className="text-sm">
                        Click and Upload Medical image
                      </h4>
                    </>
                  )}
                </label>
                {/* <span className="text-[13px] text-red-600 h-4">
                  {errors && errors.medicalPhoto && errors.medicalPhoto.message}
                </span> */}
              </div>
              <div className="flex flex-col gap-1">
                <input
                  type="file"
                  id="gatePassImage"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => setGatePassImage(e.target.files[0])}
                />
                <label
                  htmlFor="gatePassImage"
                  className="w-full h-48 rounded-md border bg-white/90 flex flex-col gap-2 cursor-pointer justify-center items-center"
                >
                  {gatePassImage ? (
                    <div className="w-full h-full relative">
                      <X
                        className="w-4 absolute right-2 top-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          setGatePassImage(undefined);
                        }}
                      />
                      <img
                        src={
                          typeof gatePassImage == "string"
                            ? gatePassImage
                            : URL.createObjectURL(gatePassImage)
                        }
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <>
                      <UploadIcon className="w-5" />
                      <h4 className="text-sm">
                        Click and Upload gatepass image
                      </h4>
                    </>
                  )}
                </label>
                {/* <span className="text-[13px] text-red-600 h-4">
                  {errors &&
                    errors.gatePassImage &&
                    errors.gatePassImage.message}
                </span> */}
              </div>
              <div className="flex flex-col gap-1">
                <input
                  type="file"
                  id="contractImage"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => setContractImage(e.target.files[0])}
                />
                <label
                  htmlFor="contractImage"
                  className="w-full h-48 rounded-md border bg-white/90 flex flex-col gap-2 cursor-pointer justify-center items-center"
                >
                  {contractImage ? (
                    <div className="w-full h-full relative">
                      <X
                        className="w-4 absolute right-2 top-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          setContractImage(undefined);
                        }}
                      />
                      <img
                        src={
                          typeof contractImage == "string"
                            ? contractImage
                            : URL.createObjectURL(contractImage)
                        }
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <>
                      <UploadIcon className="w-5" />
                      <h4 className="text-sm">
                        Click and Upload contract image
                      </h4>
                    </>
                  )}
                </label>
                {/* <span className="text-[13px] text-red-600 h-4">
                  {errors &&
                    errors.contractImage &&
                    errors.contractImage.message}
                </span> */}
              </div>
            </div>
            <div className="w-full border p-2 rounded-md shadow-md">
              <div className="w-full border-b pb-2">
                <h3 className="text-lg font-semibold">Uniform</h3>
              </div>

              <div className="w-full grid grid-cols-1 lg:grid-cols-2 mt-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label htmlFor="" className="text-sm">
                    Uniform Shirt
                  </label>
                  <Input
                    accept="number"
                    value={uniformShirts ? uniformShirts : ""}
                    onChange={(e) => setUniformShirt(e.target.value)}
                    type={"number"}
                    className={cn("w-full bg-white")}
                    placeholder={"Uniform shirt count"}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label htmlFor="" className="text-sm">
                    Uniform Pant
                  </label>
                  <Input
                    accept="number"
                    value={uniformPant ? uniformPant : ""}
                    onChange={(e) => setUniformPant(e.target.value)}
                    type={"number"}
                    className={cn("w-full bg-white")}
                    placeholder={"Uniform pant count"}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mt-3">
                <div className="flex flex-col gap-1">
                  <label htmlFor="" className="text-sm">
                    Uniform Cap
                  </label>
                  <Input
                    accept="number"
                    value={uniformCap ? uniformCap : ""}
                    onChange={(e) => setUniformCap(e.target.value)}
                    type={"number"}
                    className={cn("w-full bg-white")}
                    placeholder={"Uniform cap count"}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label htmlFor="" className="text-sm">
                    Uniform Shoe
                  </label>
                  <Input
                    value={uniformShoe ? uniformShoe : ""}
                    accept="number"
                    onChange={(e) => setUniformShoe(e.target.value)}
                    type={"number"}
                    className={cn("w-full bg-white")}
                    placeholder={"Uniform shoe count"}
                  />
                </div>
                {/* uniformDate */}
                <div className="flex flex-col gap-1 ">
                  <label htmlFor="" className="text-sm">
                    Uniform date
                  </label>
                  <Input
                    value={
                      (uniformDate &&
                        uniformDate?.toISOString().split("T")[0]) ||
                      ""
                    }
                    onChange={(e) => {
                      setUniformDate(new Date(e.target.value));
                    }}
                    type={"date"}
                    className={cn("w-full bg-white")}
                    placeholder={"Select Uniform date"}
                  />
                </div>
              </div>
              <div className="w-full flex justify-end mt-4">
                <Button type="button">Add uniform</Button>
              </div>
              <div className="w-full mt-3 border p-2 rounded-md space-y-2 relative">
                {uniforms?.map((uniform, idx) => (
                  <div
                    key={idx}
                    className="w-full bg-white flex flex-wrap min-h-10 rounded-md p-1 items-center gap-2"
                  >
                    <div className="h-full px-2 bg-slate-200 rounded-md text-sm py-1">
                      {uniform?.uniformShirt} pieces of Shirt
                    </div>
                    <div className="h-full px-2 bg-slate-200 rounded-md text-sm py-1">
                      {uniform?.uniformPant} pieces of Pant
                    </div>
                    <div className="h-full px-2 bg-slate-200 rounded-md text-sm py-1">
                      {uniform?.uniformCap} pieces of Shoe
                    </div>
                    <div className="h-full px-2 bg-slate-200 rounded-md text-sm py-1">
                      {uniform?.uniformShoe} pieces of Cap
                    </div>
                    <div className="h-full px-2 bg-slate-200 rounded-md text-sm py-1">
                      date: {format(String(uniform?.uniformDate), "PPP")}
                    </div>
                    <button
                      type="button"
                      className="bg-gray-400 rounded-full p-1 size-7 flex justify-center items-center text-white"
                      onClick={() => {
                        setUniforms(uniforms.filter((_, Idx) => Idx !== idx));
                      }}
                    >
                      <X className="w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div className="w-full flex justify-end">
              <Button>Submit</Button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}
