import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { api } from "@/services/api";
import { VehicleTable } from "./CompanyTableColumns/VehicleTable";
import { EditVehicle } from "./EditVehicle";

export function VehicleList({ onVehicleUpdated }) {
  const [srch, setSrch] = useState("");
  const [vehicles, setVehicles] = useState([]);
  const [editingVehicle, setEditingVehicle] = useState(null);

  const fetchVehicles = async () => {
    try {
      const response = await api.get("vehicles/");
      setVehicles(response.data.results);
    } catch (error) {
      console.error("Error fetching vehicles:", error);
      toast({
        title: "Error",
        description: "Failed to load vehicles.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, [onVehicleUpdated]);

  const handleCloseEdit = () => {
    setEditingVehicle(null);
  };

  const handleVehicleUpdated = () => {
    fetchVehicles();  
    onVehicleUpdated();  
  };
  

  const filteredVehicles = vehicles.filter(vehicle =>
    vehicle.vehicle_name.toLowerCase().includes(srch.toLowerCase())
  );

  return (
    <main className="w-full h-full bg-white rounded-md p-2">
      <section className="w-full">
        <div className="w-full flex justify-end">
          <Input
            value={srch}
            onChange={(e) => setSrch(e.target.value)}
            className="shadow-md md:w-[300px] w-full "
            placeholder="Search Vehicle name"
          />
        </div>

        <VehicleTable
          from="vehicle"
          data={filteredVehicles} 
        />

        {editingVehicle && (
          <EditVehicle
            vehicleId={editingVehicle}
            onClose={handleCloseEdit}
            onVehicleUpdated={handleVehicleUpdated}
          />
        )}
      </section>
    </main>
  );
}
