import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InputWithLabel } from "@/components/ui/InputWithLabel";
import { UploadIcon, X } from "lucide-react";
import React, { useState, useEffect, useCallback } from "react";
import { api, fetchCompanies } from "@/services/api"; 
import { CompanyList } from "./CompanyList";
import { toast } from "@/components/ui/use-toast";
import CompanyTable from "./CompanyTableColumns/CompanyTable";

export function AddCompany() {
  const [companies, setCompanies] = useState([]);

  const fetchCompanyData = useCallback(async () => {
    try {
      const data = await fetchCompanies();
      if (Array.isArray(data.results)) {
        setCompanies(data.results);
      }
    } catch (error) {
      console.error("Error fetching companies:", error);
      toast({
        title: "Error",
        description: "Failed to load companies.",
        variant: "destructive",
      });
    }
  }, []);

  useEffect(() => {
    fetchCompanyData();
  }, [fetchCompanyData]);

  const handleCompanyUpdated = useCallback((updatedData) => {
    setCompanies(updatedData);
  }, []);

  const handleCompanyAdd = async (e) => {
    e.preventDefault(); 

    const formData = new FormData();
    formData.append("company_name", companyName);
    formData.append("cr_no", crNo);
    formData.append("cr_expiry", crExpiry.toISOString().split("T")[0]); 
    formData.append("ruksa_number", RuksaNo);
    formData.append("ruksa_expiry", RuksaExpiry?.toISOString().split("T")[0]); 
    formData.append("computer_card", computerCard);
    formData.append(
      "computer_card_expiry",
      cardexpireDate?.toISOString().split("T")[0]
    ); // Format date if needed
    if (crImage) formData.append("cr_image", crImage);
    if (RuksImage) formData.append("ruksa_image", RuksImage);
    if (computerCardImage)
      formData.append("computer_card_image", computerCardImage);

    try {
      const response = await api.post("/company-details/", formData, {
        headers: {
          "Content-Type": "multipart/form-data", 
        },
      });
      
      toast({
        title: "Success",
        description: "Company added successfully.",
      })

      setCompanyName("");
      setCrNo("");
      setCrExpiry(null);
      setRuksaNo("");
      setRuksaExpiry(null);
      setComputerCard("");
      setCardExpireDate(null);
      setCrImage(null);
      setRuksImage(null);
      setComputerCardImage(null)
    } catch (error) {
      console.error("Error adding company:", error);
      // Handle error, e.g., show error message
    }
  };

  const [companyName, setCompanyName] = useState("");
  const [crNo, setCrNo] = useState("");
  const [crExpiry, setCrExpiry] = useState(null);
  const [RuksaNo, setRuksaNo] = useState("");
  const [RuksaExpiry, setRuksaExpiry] = useState(null);
  const [computerCard, setComputerCard] = useState("");
  const [cardexpireDate, setCardExpireDate] = useState(null);
  const [crImage, setCrImage] = useState(null);
  const [RuksImage, setRuksImage] = useState(null);
  const [computerCardImage, setComputerCardImage] = useState(null);

  return (
    <>
    <main className="w-full h-full bg-white rounded-md p-2">
      <section className="w-full p-2 flex justify-center">
        <div className="w-full mx-auto p-5 min-h-64 shadow-md rounded-md border">
          <div className="w-full border-b pb-3">
            <h1 className="font-semibold text-2xl">Company</h1>
          </div>
          <form className="w-full mt-3" onSubmit={handleCompanyAdd}>
            <div className="w-full grid grid-cols-1 lg:grid-cols-4 gap-2">
              <InputWithLabel
                label={"Company name"}
                placholder={"Enter company name"}
                setValue={setCompanyName}
                value={companyName}
              />
              <InputWithLabel
                label={"Cr NO"}
                placholder={"Enter cr number"}
                setValue={setCrNo}
                value={crNo}
              />
              <div className="flex flex-col gap-1">
                <label htmlFor="" className="text-sm">
                  Cr expiry
                </label>
                <Input
                  value={crExpiry?.toISOString().split("T")[0] || ""}
                  onChange={(e) => {
                    setCrExpiry(new Date(e.target.value));
                  }}
                  type={"date"}
                  className="w-full bg-white"
                />
              </div>
              <InputWithLabel
                label={"Ruksa number"}
                placholder={"Enter Ruksa number"}
                setValue={setRuksaNo}
                value={RuksaNo}
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
                  }}
                  type={"date"}
                  className="w-full bg-white"
                />
              </div>
              <InputWithLabel
                label={"Computer Card"}
                placholder={"computer card"}
                value={computerCard}
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
                  }}
                  type={"date"}
                  className="w-full bg-white"
                />
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
                      <h4 className="text-sm">
                        Click and Upload Computer card image
                      </h4>
                    </>
                  )}
                </label>
              </div>
            </div>
            <div className="w-full flex justify-end mt-4">
              <Button type={"submit"}>Submit</Button>
            </div>
          </form>
        </div>
      </section>


    </main>
          {/* Company List Section */}
          <section className="w-full p-2 flex justify-center">
          <div className="w-full mx-auto p-5 min-h-64 shadow-md rounded-md border">
            <CompanyList /> 
          </div>
        </section>
        </>
  );
}
