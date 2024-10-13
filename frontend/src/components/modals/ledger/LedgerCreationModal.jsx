import { api } from "@/services/api"; 
import React, { useState, useEffect } from "react";

const LedgerCreationModal = ({ isOpen, onClose, refreshLedgerOptions }) => {
  const [name, setName] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [openingBalance, setOpeningBalance] = useState("");
  const [group, setGroup] = useState("");
  const [debitCredit, setDebitCredit] = useState("");
  const [groupOptions, setGroupOptions] = useState([]);
  const [error, setError] = useState(null);

  const [masterDataType, setMasterDataType] = useState(""); 
  const [customers, setCustomers] = useState([]); 
  const [employees, setEmployees] = useState([]); 
  const [selectedMasterData, setSelectedMasterData] = useState(""); 

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        let allGroups = [];
        let nextUrl = "/main-groups/";

        while (nextUrl) {
          const response = await api.get(nextUrl);
          const data = response.data;

          if (Array.isArray(data.results)) {
            allGroups = [...allGroups, ...data.results];
          } else {
            console.error("Unexpected API response format for groups", data);
          }

          nextUrl = data.next;
        }

        setGroupOptions(allGroups);
      } catch (error) {
        console.error("There was an error fetching the groups!", error);
      }
    };

    fetchGroups();
  }, []);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        let allCustomers = [];
        let nextUrl = "/clients/";

        while (nextUrl) {
          const response = await api.get(nextUrl);
          const data = response.data;

          if (Array.isArray(data.results)) {
            allCustomers = [...allCustomers, ...data.results];
          } else {
            console.error("Unexpected API response format for customers", data);
          }

          nextUrl = data.next;
        }

        setCustomers(allCustomers); 
      } catch (error) {
        console.error("Error fetching customers:", error);
      }
    };

    const fetchEmployees = async () => {
      try {
        let allEmployees = [];
        let nextUrl = "/employees/";

        while (nextUrl) {
          const response = await api.get(nextUrl);
          const data = response.data;

          if (Array.isArray(data.results)) {
            allEmployees = [...allEmployees, ...data.results];
          } else {
            console.error("Unexpected API response format for employees", data);
          }

          nextUrl = data.next; 
        }

        setEmployees(allEmployees); 
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };

    if (masterDataType === "customer") {
      fetchCustomers();
    } else if (masterDataType === "employee") {
      fetchEmployees();
    }
  }, [masterDataType]);

  const handleSubmit = (e) => {
    e.preventDefault();
  
    const ledgerData = {
      name,
      opening_balance: openingBalance ? parseFloat(openingBalance) : 0,
      group_id: group,
      master_data: masterDataType, 
    };
  
    if (masterDataType === "customer") {
      ledgerData.customer_ref = selectedMasterData; 
    } else if (masterDataType === "employee") {
      ledgerData.employee_ref = selectedMasterData; 
    }
  
    console.log("Ledger Data:", ledgerData);
  
    api.post("/ledgers/", ledgerData)
      .then((response) => {
        console.log("Ledger created successfully:", response.data);
        onClose(); // Close the modal on successful submission
        refreshLedgerOptions();
      })
      .catch((error) => {
        console.error("There was an error creating the ledger!", error);
        setError("There was an error creating the ledger. Please try again.");
      });
  };
  

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white p-6 rounded-md shadow-lg w-1/3 relative">
        <h2 className="text-xl font-bold mb-4">Create Ledger</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-2">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border rounded p-2 w-full"
              required
            />
          </div>

          <div>
            <label className="block mb-2">Opening Balance</label>
            <input
              type="number"
              value={openingBalance}
              onChange={(e) => setOpeningBalance(e.target.value)}
              className="border rounded p-2 w-full"
              step="0.01"
            />
          </div>

          <div>
            <label className="block mb-2">Debit/Credit</label>
            <select
              value={debitCredit}
              onChange={(e) => setDebitCredit(e.target.value)}
              className="border rounded p-2 w-full"
            >
              <option value="">Select an option</option>
              <option value="DEBIT">Debit</option>
              <option value="CREDIT">Credit</option>
            </select>
          </div>

          <div>
            <label className="block mb-2">Group</label>
            <select
              value={group}
              onChange={(e) => setGroup(e.target.value)}
              className="border rounded p-2 w-full"
              required
            >
              <option value="">Select a group</option>
              {groupOptions.map((grp) => (
                <option key={grp.id} value={grp.id}>
                  {grp.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-2">Master Data</label>
            <select
              value={masterDataType}
              onChange={(e) => {
                setMasterDataType(e.target.value);
                setSelectedMasterData(""); // Reset selected master data
                // Reset the customer and employee lists when changing master data type
                setCustomers([]);
                setEmployees([]);
              }}
              className="border rounded p-2 w-full"
              required
            >
              <option value="">Select Master Data Type</option>
              <option value="customer">Customer</option>
              <option value="employee">Employee</option>
            </select>
          </div>

          {masterDataType && (
            <div>
              <label className="block mb-2">
                {masterDataType.charAt(0).toUpperCase() + masterDataType.slice(1)} Name
              </label>
              <select
                value={selectedMasterData}
                onChange={(e) => setSelectedMasterData(e.target.value)}
                className="border rounded p-2 w-full"
                required
              >
                <option value="">Select {masterDataType}</option>
                {(masterDataType === "customer" ? customers : employees).map((data) => (
                  <option key={data.id} value={data.id}>
                    {data.name} {masterDataType === "employee" && `(${data.employee_id})`} {/* Display employee ID if employee is selected */}
                  </option>
                ))}
              </select>
            </div>
          )}

          {error && <p className="text-red-500">{error}</p>}

          <div className="flex justify-center mt-4">
            <button
              type="submit"
              className="bg-[#6f42c1] text-white py-2 px-4 rounded"
            >
              Create
            </button>
          </div>
        </form>

        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl font-bold"
        >
          &times;
        </button>
      </div>
    </div>
  );
};

export default LedgerCreationModal;
