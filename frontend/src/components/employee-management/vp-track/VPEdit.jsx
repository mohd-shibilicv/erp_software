import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectValue,
  SelectTrigger,
} from "@/components/ui/select";
import { api, fetchCompanies, fetchEmployees } from "@/services/api";
import { toast } from "@/components/ui/use-toast";

const nations = [
  "India",
  "Pakistan",
  "Bangladesh",
  "Sri Lanka",
  "Nepal",
  "Philippines",
  "Indonesia",
  "Malaysia",
  "Thailand",
  "Vietnam",
];

export function VPEdit({ vpData, onClose, onUpdate }) {
  const [company, setCompany] = useState("");
  const [companies, setCompanies] = useState([]);
  const [employee, setEmployee] = useState("");
  const [employees, setEmployees] = useState([]);
  const [computerCard, setComputerCard] = useState(vpData.computer_card || "");
  const [nation, setNation] = useState(vpData.nation || "");
  const [vpNo, setVpNo] = useState(vpData.vp_no || "");
  const [vpExpiry, setVpExpiry] = useState(vpData.vp_expiry ? new Date(vpData.vp_expiry) : null);
  const [employeeDesignation, setEmployeeDesignation] = useState(vpData.employee_designation || "");
  const [visaCount, setVisaCount] = useState(vpData.visa_count?.toString() || "");

  useEffect(() => {
    const loadCompaniesAndEmployees = async () => {
      try {
        const companiesData = await fetchCompanies();
        const employeesData = await fetchEmployees();
        
        setCompanies(companiesData.results || []);
        setEmployees(employeesData.results || []);
        
        // Set initial values for company and employee
        if (vpData.company) {
          setCompany(vpData.company.toString());
          const selectedCompany = companiesData.results.find(c => c.id.toString() === vpData.company.toString());
          if (selectedCompany) {
            setComputerCard(selectedCompany.computer_card || "");
          }
        }
        
        if (vpData.employee) {
          setEmployee(vpData.employee.toString());
          const selectedEmployee = employeesData.results.find(e => e.id.toString() === vpData.employee.toString());
          if (selectedEmployee) {
            setEmployeeDesignation(selectedEmployee.employee_position || "");
            setNation(selectedEmployee.nationality || "");
          }
        }
      } catch (error) {
        console.error("Error fetching companies and employees:", error);
        setCompanies([]);
        setEmployees([]);
      }
    };

    loadCompaniesAndEmployees();
  }, [vpData]);

  const handleCompanyChange = (value) => {
    setCompany(value);
    const selected = companies.find(c => c.id.toString() === value);
    if (selected) {
      setComputerCard(selected.computer_card || "");
    }
  };

  const handleEmployeeChange = (value) => {
    setEmployee(value);
    const selected = employees.find(e => e.id.toString() === value);
    setEmployeeDesignation(selected?.employee_position || "");
    setNation(selected?.nationality || "");
  };

  const handleVpTrackUpdate = async (e) => {
    e.preventDefault();
  
    // Check if nation is selected
    if (!nation) {
      toast({
        title: "Error",
        description: "Please select a nation before submitting the form.",
        variant: "destructive",
      });
      return; // Prevent form submission
    }
  
    const updatedVPTrack = {
      company,
      employee,
      computer_card: computerCard,
      nation,
      vp_no: vpNo,
      vp_expiry: vpExpiry ? vpExpiry.toISOString().split("T")[0] : null,
      employee_designation: employeeDesignation,
      visa_count: visaCount,
    };
  
    try {
      const response = await api.put(`/vptracks/${vpData.id}/`, updatedVPTrack);
      toast({
        title: "Success",
        description: "VP Track updated successfully.",
      });
      onUpdate();
    } catch (error) {
      console.error("Error updating VP Track:", error);
      toast({
        title: "Error",
        description: "Failed to update VP Track.",
        variant: "destructive",
      });
    }
  };
  

  return (
    <form onSubmit={handleVpTrackUpdate} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {/* Company Selection */}
        <div className="flex flex-col gap-1">
          <label htmlFor="" className="text-sm">Select Company</label>
          <Select value={company} onValueChange={handleCompanyChange}>
            <SelectTrigger className="w-full bg-white">
              <SelectValue placeholder="Select Company" />
            </SelectTrigger>
            <SelectContent>
              {companies.map((c) => (
                <SelectItem key={c.id} value={c.id.toString()}>
                  {c.company_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Employee Selection */}
        <div className="flex flex-col gap-1">
          <label htmlFor="" className="text-sm">Select Employee</label>
          <Select value={employee} onValueChange={handleEmployeeChange}>
            <SelectTrigger className="w-full bg-white">
              <SelectValue placeholder="Select Employee" />
            </SelectTrigger>
            <SelectContent>
              {employees.map((emp) => (
                <SelectItem key={emp.id} value={emp.id.toString()}>
                  {emp.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Computer Card */}
        <div className="flex flex-col gap-1">
          <label htmlFor="" className="text-sm">Computer Card</label>
          <Input
            value={computerCard}
            onChange={(e) => setComputerCard(e.target.value)}
            placeholder="Computer card"
            className="bg-white"
            readOnly
          />
        </div>

        {/* Nation */}
        <div className="flex flex-col gap-1">
          <label htmlFor="" className="text-sm">Nation</label>
          <Select value={nation} onValueChange={setNation}>
            <SelectTrigger className="w-full bg-white">
              <SelectValue placeholder="Select Nation" />
            </SelectTrigger>
            <SelectContent>
              {nations.map((n) => (
                <SelectItem key={n} value={n}>
                  {n}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* VP No */}
        <div className="flex flex-col gap-1">
          <label htmlFor="" className="text-sm">Enter VP No</label>
          <Input
            value={vpNo}
            onChange={(e) => setVpNo(e.target.value)}
            placeholder="VP No"
            className="w-full bg-white"
          />
        </div>

        {/* VP Expiry */}
        <div className="flex flex-col gap-1">
          <label htmlFor="" className="text-sm">VP Expiry</label>
          <Input
            value={vpExpiry ? vpExpiry.toISOString().split("T")[0] : ""}
            onChange={(e) => setVpExpiry(e.target.value ? new Date(e.target.value) : null)}
            type="date"
            className="w-full bg-white"
            placeholder="VP expiry"
          />
        </div>

        {/* Employee Designation */}
        <div className="flex flex-col gap-1">
          <label htmlFor="" className="text-sm">Employee Designation</label>
          <Input
            value={employeeDesignation}
            onChange={(e) => setEmployeeDesignation(e.target.value)}
            type="text"
            className="w-full bg-white"
            placeholder="Employee designation"
          />
        </div>

        {/* Visa Count */}
        <div className="flex flex-col gap-1">
          <label htmlFor="" className="text-sm">Visa Count</label>
          <Input
            value={visaCount}
            onChange={(e) => setVisaCount(e.target.value)}
            type="number"
            className="w-full bg-white"
            placeholder="Visa count"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">Update</Button>
      </div>
    </form>
  );
}