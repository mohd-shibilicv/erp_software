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
import { useEffect, useState } from "react";
import { api, fetchCompanies } from "@/services/api";
import { toast } from "@/components/ui/use-toast";

export function EditVehicle({ vehicleId, onClose, onVehicleUpdated }) {
  const [vehicleName, setVehicleName] = useState("");
  const [vehicleNo, setVehicleNo] = useState("");
  const [expiryDate, setExpiryDate] = useState(undefined);
  const [vehicleModel, setVehicleModel] = useState("");
  const [ownerId, setOwnerId] = useState("");
  const [companies, setCompanies] = useState([]);
  const [company, setCompany] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchCompanies();
        if (Array.isArray(data.results)) {
          setCompanies(data.results);
        } else {
          setCompanies([]);
        }

        if (vehicleId) {
          const vehicleData = await api.get(`vehicles/${vehicleId}/`);
          const { vehicle_name, vehicle_no, expiry_date, vehicle_model, owner_id, company } = vehicleData.data;
          setVehicleName(vehicle_name);
          setVehicleNo(vehicle_no);
          setExpiryDate(new Date(expiry_date));
          setVehicleModel(vehicle_model);
          setOwnerId(owner_id);
          setCompany(company); // Set selected company
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Error",
          description: "Failed to load data.",
        });
      }
    };

    fetchData();
  }, [vehicleId]);

  const handleUpdateVehicle = async (e) => {
    e.preventDefault();
    const formattedExpiryDate = expiryDate ? expiryDate.toISOString().split("T")[0] : "";

    try {
      const response = await api.patch(`vehicles/${vehicleId}/`, {
        vehicle_name: vehicleName,
        vehicle_no: vehicleNo,
        expiry_date: formattedExpiryDate,
        vehicle_model: vehicleModel,
        owner_id: ownerId,
        company: company,
      });

      if (response.status === 200) {
        toast({
          title: "Success",
          description: "Vehicle updated successfully.",
        });
        onVehicleUpdated(); // Call this to trigger the update
        onClose(); // Close the modal
      } else {
        toast({
          title: "Error",
          description: "Failed to update vehicle. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error updating vehicle:", error);
      toast({
        title: "Error",
        description: "An error occurred while updating the vehicle.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="w-full bg-white rounded-md p-2">
      <div className="w-full border-b pb-3">
        <h1 className="font-semibold text-2xl">Edit Vehicle</h1>
      </div>
      <form className="w-full mt-3" onSubmit={handleUpdateVehicle}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
          <InputWithLabel
            label={"Vehicle name"}
            placeholder={"enter vehicle name"}
            value={vehicleName}
            setValue={setVehicleName}
          />
          <InputWithLabel
            label={"Vehicle No."}
            placeholder={"enter vehicle number"}
            setValue={setVehicleNo}
            value={vehicleNo}
          />
          <div className="flex flex-col gap-1">
            <label htmlFor="" className="text-sm">
              Vehicle expiry date
            </label>
            <Input
              value={expiryDate?.toISOString().split("T")[0] || ""}
              onChange={(e) => setExpiryDate(new Date(e.target.value))}
              placeholder="Select date here"
              type={"date"}
              className="w-full bg-white"
            />
          </div>
        </div>
        <div className="grid grid-col-1 lg:grid-cols-3 gap-5 mt-4">
          <InputWithLabel
            label={"Vehicle Model"}
            placeholder={"Enter vehicle model"}
            value={vehicleModel}
            setValue={setVehicleModel}
          />
          <InputWithLabel
            label={"Owner Id"}
            placeholder={"Enter owner id"}
            value={ownerId}
            setValue={setOwnerId}
          />
          <div className="flex flex-col gap-1">
            <label htmlFor="" className="text-sm">
              Select company
            </label>
            <Select
              onValueChange={(value) => setCompany(value)}
              value={company}
            >
              <SelectTrigger className="w-full bg-white">
                <SelectValue placeholder="Select Company" />
              </SelectTrigger>
              <SelectContent>
                {companies.length > 0 ? (
                  companies.map((company) => (
                    <SelectItem
                      key={String(company?.id)}
                      value={String(company?.id)}
                    >
                      {company?.company_name}
                    </SelectItem>
                  ))
                ) : (
                  <p>No companies available</p>
                )}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="w-full flex mt-4 justify-end">
          <Button type="submit">Update</Button>
          <Button type="button" onClick={onClose} className="ml-2">Cancel</Button>
        </div>
      </form>
    </div>
  );
}
