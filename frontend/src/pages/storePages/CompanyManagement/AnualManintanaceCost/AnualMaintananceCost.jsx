import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InputWithLabel } from "@/components/ui/InputWithLabel";
import { cn } from "@/lib/utils";
import { Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { api, fetchAmc } from "@/services/api";
import { toast } from "@/components/ui/use-toast";
import { AMCTable } from "./AmcTable";

export function AnualManintananceCost() {
  const [fireCertificationImage, setFireCertificationImage] =
    useState(undefined);
  const [amcContractImage, setAmcContractImage] = useState(undefined);
  const [remarks, setRemarks] = useState("");
  const [amcContractStart, setAmcContractStart] = useState(undefined);
  const [amcContractEnd, setAmcContractEnd] = useState(undefined);
  const [amcRemarks, setAmcRemarks] = useState("");
  const [amcPercentage, setAmcPercentage] = useState("");
  const [amcPercentageAmount, setAmcPercentageAmount] = useState("");
  const [amcTotalAmount, setAmcTotalAmount] = useState("");

  const [amcData, setAmcData] = useState([]);

  useEffect(() => {
    getAmc();
  }, []);

  useEffect(() => {
    if (amcTotalAmount && amcPercentage) {
      const calculatedAmount = (parseFloat(amcTotalAmount) * parseFloat(amcPercentage)) / 100;
      setAmcPercentageAmount(calculatedAmount.toFixed(2));
    } else {
      setAmcPercentageAmount("");
    }
  }, [amcTotalAmount, amcPercentage]);

  const getAmc = async () => {
    try {
      const data = await fetchAmc();
      setAmcData(data.results);
    } catch (error) {
      console.error("Error fetching AMC data:", error);
      toast({
        title: "Error",
        description: "Failed to fetch AMC data. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleFireCertificationAdd = async (e) => {
    e.preventDefault();

    // Create a new FormData object
    const formData = new FormData();

    if (fireCertificationImage) {
      formData.append("fire_certification_image", fireCertificationImage);
    }

    if (amcContractImage) {
      formData.append("amc_contract_image", amcContractImage);
    }

    if (remarks) {
      formData.append("fire_contract_remark", remarks);
    }

    if (amcContractStart) {
      formData.append(
        "amc_start_date",
        amcContractStart.toISOString().split("T")[0]
      );
    }

    if (amcContractEnd) {
      formData.append(
        "amc_end_date",
        amcContractEnd.toISOString().split("T")[0]
      );
    }

    if (amcRemarks) {
      formData.append("amc_contract_remark", amcRemarks);
    }

    if (amcPercentage) {
      formData.append("amc_percentage", amcPercentage);
    }

    if (amcPercentageAmount) {
      formData.append("amc_percentage_amount", amcPercentageAmount);
    }

    if (amcTotalAmount) {
      formData.append("amc_total_amount", amcTotalAmount);
    }

    try {
      const response = await api.post("/amc/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("AMC submitted successfully:", response.data);
      toast({
        title: "Success",
        description: "AMC added successfully.",
      });
      // Refresh AMC data after successful submission
      getAmc();
      // Reset form fields
      resetForm();
    } catch (error) {
      console.error("Error submitting AMC:", error);
      toast({
        title: "Error",
        description: "Error submitting AMC. Please try again.",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFireCertificationImage(undefined);
    setAmcContractImage(undefined);
    setRemarks("");
    setAmcContractStart(undefined);
    setAmcContractEnd(undefined);
    setAmcRemarks("");
    setAmcPercentage("");
    setAmcPercentageAmount("");
    setAmcTotalAmount("");
  };

  const handleAMCUpdated = () => {
    // Refresh AMC data after an update
    getAmc();
  };

  return (
    <main className="w-full h-full rounded-md p-2">
      <section className="w-full p-2 flex justify-center">
        <div className="w-full">
          <div className="w-full border rounded-none p-4 shadow-md bg-gray-50">
            <div className="w-full">
              <h1 className="font-semibold text-[20px]">
                Add Anual Maintenance Cost
              </h1>
            </div>
            <form onSubmit={handleFireCertificationAdd} className="w-full mt-3">
              <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-5">
                <input
                  type="file"
                  className="hidden"
                  id="fireCertificationImage"
                  name="fireCertificationImage"
                  onChange={(e) => setFireCertificationImage(e.target.files[0])}
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
                    <span className="text-sm font-semibold text-center">
                      Click and Upload Fire and certification image
                    </span>
                  )}
                </label>
                <input
                  type="file"
                  className="hidden"
                  id="amcContractImage"
                  name="amcContractImage"
                  onChange={(e) => setAmcContractImage(e.target.files[0])}
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
                    <span className="text-sm font-semibold text-center">
                      Click and Upload amc contract Image
                    </span>
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
                  <label className="text-sm">Amc contract start date</label>
                  <Input
                    value={amcContractStart?.toISOString().split("T")[0] || ""}
                    onChange={(e) =>
                      setAmcContractStart(new Date(e.target.value))
                    }
                    type={"date"}
                    className={cn("w-full bg-white")}
                    placeholder={"amc contract start date"}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm">Amc contract end date</label>
                  <Input
                    value={amcContractEnd?.toISOString().split("T")[0] || ""}
                    onChange={(e) =>
                      setAmcContractEnd(new Date(e.target.value))
                    }
                    type={"date"}
                    className={cn("w-full bg-white")}
                    placeholder={"amc contract end date"}
                  />
                </div>
                <InputWithLabel
                  label={"Enter amc contract remark"}
                  setValue={setAmcRemarks}
                  value={amcRemarks}
                  placholder={"Enter amc remark"}
                />
                <InputWithLabel
                  label="AMC Percentage"
                  setValue={setAmcPercentage}
                  value={amcPercentage}
                  placeholder="Enter AMC percentage"
                />
                <InputWithLabel
                  label="AMC Percentage Amount"
                  value={amcPercentageAmount}
                  placeholder="Calculated automatically"
                  disabled
                />
                <InputWithLabel
                  label="AMC Total Amount"
                  setValue={setAmcTotalAmount}
                  value={amcTotalAmount}
                  placeholder="Enter AMC total amount"
                />
              </div>
              <div className="w-full flex justify-end mt-4">
                <Button type={"submit"}>Submit</Button>
              </div>
            </form>
          </div>
        </div>
      </section>
      {/* AMC List Section */}
      <section className="w-full p-2 flex justify-center">
        <div className="w-full mx-auto p-5 min-h-64 shadow-md rounded-md border">
          <AMCTable data={amcData} onAMCUpdated={handleAMCUpdated} />
        </div>
      </section>
    </main>
  );
}
