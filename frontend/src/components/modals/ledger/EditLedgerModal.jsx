import React, { useState, useEffect } from "react";
import { api } from "@/services/api"; // Assuming `api` is an Axios instance

const EditLedgerModal = ({ ledger, groups, onClose, onSave }) => {
  const [updatedLedger, setUpdatedLedger] = useState(ledger);
  const [error, setError] = useState(null);
  const [masterDataType, setMasterDataType] = useState(ledger.master_data || ""); // Initialize with ledger's master data
  const [customers, setCustomers] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedMasterData, setSelectedMasterData] = useState(
    ledger.master_data === "customer" ? ledger.customer_ref : ledger.employee_ref || ""
  );

  // Fetch customers and employees
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await api.get("/clients/");
        setCustomers(response.data.results);
      } catch (error) {
        console.error("Error fetching customers:", error);
      }
    };

    const fetchEmployees = async () => {
      try {
        const response = await api.get("/employees/");
        setEmployees(response.data.results);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };

    fetchCustomers();
    fetchEmployees();
  }, []);

  useEffect(() => {
    console.log("Master Data Type:", masterDataType);
    console.log("Customers:", customers);
    console.log("Employees:", employees);
    console.log("Selected Master Data:", selectedMasterData);

    // Update selected master data when switching between customer and employee
    if (masterDataType === "customer") {
      setSelectedMasterData(updatedLedger.customer_ref || "");
    } else if (masterDataType === "employee") {
      setSelectedMasterData(updatedLedger.employee_ref || "");
    }
  }, [masterDataType, updatedLedger]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedLedger({
      ...updatedLedger,
      [name]: name === "group" ? groups.find(group => group.id === parseInt(value)) : value,
    });
  };

  const handleMasterDataChange = (e) => {
    const value = e.target.value;
    setMasterDataType(value);
    setSelectedMasterData(""); // Reset selected master data when changing type
  };

  const handleSave = async () => {
    try {
      const data = {
        name: updatedLedger.name,
        opening_balance: updatedLedger.opening_balance,
        group_id: updatedLedger.group.id,
        debit_credit: updatedLedger.debit_credit,
        master_data: masterDataType,
        ...(masterDataType === "customer" && { customer_ref: selectedMasterData }),
        ...(masterDataType === "employee" && { employee_ref: selectedMasterData }),
      };

      const response = await api.patch(`/ledgers/${updatedLedger.id}/`, data);

      onSave(response.data);
      onClose(); // Close the modal
    } catch (err) {
      console.error("Failed to update the ledger:", err);
      setError("There was an error updating the ledger. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-md w-[600px]">
        <h2 className="text-xl font-bold mb-4">Edit Ledger</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="grid grid-cols-2 gap-4">
          <div className="mb-4 col-span-2">
            <label className="block text-sm font-medium mb-2" htmlFor="name">
              Ledger Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={updatedLedger.name}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4 col-span-2">
            <label className="block text-sm font-medium mb-2" htmlFor="opening_balance">
              Opening Balance
            </label>
            <input
              type="text"
              id="opening_balance"
              name="opening_balance"
              value={updatedLedger.opening_balance}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4 col-span-2">
            <label className="block text-sm font-medium mb-2">Debit/Credit</label>
            <select
              name="debit_credit"
              value={updatedLedger.debit_credit}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            >
              <option value="">Select Debit/Credit</option>
              <option value="DEBIT">Debit</option>
              <option value="CREDIT">Credit</option>
            </select>
          </div>
          <div className="mb-4 col-span-2">
            <label className="block text-sm font-medium mb-2" htmlFor="group">
              Group
            </label>
            <select
              id="group"
              name="group"
              value={updatedLedger.group.id}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            >
              {groups.map((group) => (
                <option key={group.id} value={group.id}>
                  {group.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4 col-span-2">
            <label className="block text-sm font-medium mb-2">Master Data</label>
            <select
              value={masterDataType}
              onChange={handleMasterDataChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            >
              <option value="">Select Master Data Type</option>
              <option value="customer">Customer</option>
              <option value="employee">Employee</option>
            </select>
          </div>

          {masterDataType && (
            <div className="mb-4 col-span-2">
              <label className="block text-sm font-medium mb-2">
                {masterDataType.charAt(0).toUpperCase() + masterDataType.slice(1)} Name
              </label>
              <select
                value={selectedMasterData}
                onChange={(e) => setSelectedMasterData(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                required
              >
                <option value="">Select {masterDataType}</option>
                {(masterDataType === "customer" ? customers : employees).map((data) => (
                  <option key={data.id} value={data.id}>
                    {data.name} {/* Display the name */}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="mr-2 bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditLedgerModal;
