import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InputWithLabel } from "@/components/ui/InputWithLabel";
import { cn } from "@/lib/utils";
import { Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { api } from "@/services/api";
import { toast } from "@/components/ui/use-toast";

export function EditAMC({ amcData, onClose, onUpdate }) {
  const [fireCertificationImage, setFireCertificationImage] = useState(amcData.fire_certification_image);
  const [amcContractImage, setAmcContractImage] = useState(amcData.amc_contract_image);
  const [remarks, setRemarks] = useState(amcData.fire_contract_remark);
  const [amcContractStart, setAmcContractStart] = useState(new Date(amcData.amc_start_date));
  const [amcContractEnd, setAmcContractEnd] = useState(new Date(amcData.amc_end_date));
  const [amcRemarks, setAmcRemarks] = useState(amcData.amc_contract_remark);
  const [amcPercentage, setAmcPercentage] = useState(amcData.amc_percentage || "");
  const [amcPercentageAmount, setAmcPercentageAmount] = useState(amcData.amc_percentage_amount || "");
  const [amcTotalAmount, setAmcTotalAmount] = useState(amcData.amc_total_amount || "");

  useEffect(() => {
    if (amcTotalAmount && amcPercentage) {
      const calculatedAmount = (parseFloat(amcTotalAmount) * parseFloat(amcPercentage)) / 100;
      setAmcPercentageAmount(calculatedAmount.toFixed(2));
    } else {
      setAmcPercentageAmount("");
    }
  }, [amcTotalAmount, amcPercentage]);

  const handleEditAMC = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    if (fireCertificationImage instanceof File) {
      formData.append("fire_certification_image", fireCertificationImage);
    }

    if (amcContractImage instanceof File) {
      formData.append("amc_contract_image", amcContractImage);
    }

    formData.append("fire_contract_remark", remarks);
    formData.append("amc_start_date", amcContractStart.toISOString().split("T")[0]);
    formData.append("amc_end_date", amcContractEnd.toISOString().split("T")[0]);
    formData.append("amc_contract_remark", amcRemarks);
    formData.append("amc_percentage", amcPercentage);
    formData.append("amc_percentage_amount", amcPercentageAmount);
    formData.append("amc_total_amount", amcTotalAmount);

    try {
      const response = await api.put(`/amc/${amcData.id}/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("AMC updated successfully:", response.data);
      toast({
        title: "Success",
        description: "AMC updated successfully.",
      });
      onUpdate();
    } catch (error) {
      console.error("Error updating AMC:", error);
      toast({
        title: "Error",
        description: "Error updating AMC. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleImageChange = (e, setImageFunction) => {
    const file = e.target.files[0];
    if (file) {
      setImageFunction(file);
    }
  };

  const renderImageField = (image, setImage, labelText, inputId) => (
    <div>
      <label className="text-sm font-semibold">{labelText}</label>
      <div className="w-full h-56 border rounded-md flex justify-center items-center bg-white cursor-pointer relative">
        {image && (
          <>
            <button
              type="button"
              onClick={() => setImage(null)}
              className="absolute right-4 top-4 p-3 flex justify-center items-center rounded-md bg-gray-500 text-white z-10"
            >
              <Trash2 className="w-5" />
            </button>
            <img
              src={image instanceof File ? URL.createObjectURL(image) : image}
              className="w-full h-full object-cover"
              alt={labelText}
            />
          </>
        )}
        <input
          type="file"
          id={inputId}
          className="hidden"
          onChange={(e) => handleImageChange(e, setImage)}
        />
        <label
          htmlFor={inputId}
          className="absolute inset-0 flex items-center justify-center"
        >
          {!image && <span className="text-sm font-semibold text-center">Click to upload {labelText}</span>}
        </label>
      </div>
    </div>
  );

  return (
    <form onSubmit={handleEditAMC} className="w-full mt-3">
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-5">
        {renderImageField(fireCertificationImage, setFireCertificationImage, "Fire Certification Image", "editFireCertificationImage")}
        {renderImageField(amcContractImage, setAmcContractImage, "AMC Contract Image", "editAmcContractImage")}
      </div>

      <div className="w-full mt-4 gap-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <InputWithLabel
          label="Fire and contract remark"
          setValue={setRemarks}
          value={remarks}
          placeholder="Enter fire remark"
        />
        <div className="flex flex-col gap-1">
          <label className="text-sm">AMC contract start date</label>
          <Input
            value={amcContractStart.toISOString().split("T")[0]}
            onChange={(e) => setAmcContractStart(new Date(e.target.value))}
            type="date"
            className={cn("w-full bg-white")}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm">AMC contract end date</label>
          <Input
            value={amcContractEnd.toISOString().split("T")[0]}
            onChange={(e) => setAmcContractEnd(new Date(e.target.value))}
            type="date"
            className={cn("w-full bg-white")}
          />
        </div>
        <InputWithLabel
          label="AMC contract remark"
          setValue={setAmcRemarks}
          value={amcRemarks}
          placeholder="Enter AMC remark"
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

      <div className="w-full flex justify-end mt-4 gap-2">
        <Button type="button" onClick={onClose} variant="outline">Cancel</Button>
        <Button type="submit">Update</Button>
      </div>
    </form>
  );
}
