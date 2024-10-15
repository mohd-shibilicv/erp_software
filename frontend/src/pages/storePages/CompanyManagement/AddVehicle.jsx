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
import { useEffect, useState, useCallback } from "react";
import { VehicleList } from "./VehiclesList";
import { api, fetchCompanies } from "@/services/api";
import { toast } from "@/components/ui/use-toast";

export function AddVehicle() {
  const [vehicleName, setVehicleName] = useState("");
  const [vehicleNo, setVehicleNo] = useState("");
  const [expiryDate, setExpiryDate] = useState(undefined);
  const [vehicleModel, setVehicleModel] = useState("");
  const [ownerId, setOwnerId] = useState("");
  const [companies, setCompanies] = useState([]);
  const [company, setCompany] = useState("");
  const [refreshVehicles, setRefreshVehicles] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchCompanies();
        if (Array.isArray(data.results)) {
          setCompanies(data.results); // Set companies to the results array
        } else {
          setCompanies([]); // Handle case if no data or unexpected structure
        }
      } catch (error) {
        console.error("Error fetching companies:", error);
        toast({
          title: "Error",
          description: "Failed to load companies.",
        });
      }
    };

    fetchData();
  }, []);

  const handleVehicleUpdated = useCallback(() => {
    setRefreshVehicles(prev => !prev);
  }, []);

  const handleAddVehicle = async (e) => {
    e.preventDefault();
  
    try {
      const response = await api.post("vehicles/", {
        vehicle_name: vehicleName,
        vehicle_no: vehicleNo,
        expiry_date: expiryDate,
        vehicle_model: vehicleModel,
        owner_id: ownerId,
        company: company,
      });

      if (response.status === 201) {
        toast({
          title: "Success",
          description: "Vehicle added successfully.",
        });
        setVehicleName("");
        setVehicleNo("");
        setExpiryDate(undefined);
        setVehicleModel("");
        setOwnerId("");
        setCompany("");
      } else {
        // Handle error
        alert("Failed to add vehicle. Please try again.");
      }
    } catch (error) {
      console.error("Error adding vehicle:", error);
      alert("An error occurred while adding the vehicle.");
    }
  };

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
              <Button type={"submit"}>Submit</Button>
            </div>
          </form>
        </div>
      </section>

      <section className="w-full mt-8">
        <VehicleList  />
      </section>
    </main>
  );
}
