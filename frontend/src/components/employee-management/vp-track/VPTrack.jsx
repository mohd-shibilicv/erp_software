import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectValue,
  SelectTrigger,
} from "@/components/ui/select";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { VPTable } from "./VPTable";
import { api, fetchCompanies, fetchEmployees, fetchVPTrackingList } from "@/services/api";
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

export default function VpTrack() {
  const [company, setCompany] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("");
  const [companies, setCompanies] = useState([]);
  const [employee, setEmployee] = useState("");
  const [employees, setEmployees] = useState([]);
  const [computerCard, setComputerCard] = useState("");
  const [nation, setNation] = useState("");
  const [nationBoxOpen, setNationBoxOpen] = useState(false);
  const [vpNo, setVpNo] = useState("");
  const [vpExpiry, setVpExpiry] = useState(undefined);
  const [employeeDesignation, setEmployeeDesignation] = useState("");
  const [visaCount, setVisaCount] = useState("");
  const [vpTracks, setVpTracks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const loadCompaniesAndEmployees = async () => {
      try {
        const companiesData = await fetchCompanies();
        setCompanies(companiesData.results || []);

        const employeesData = await fetchEmployees();
        setEmployees(employeesData.results || []);
      } catch (error) {
        console.error("Error fetching companies and employees:", error);
        setCompanies([]);
        setEmployees([]);
      }
    };

    const loadVPTracks = async () => {
      try {
        const vpTracksData = await fetchVPTrackingList(currentPage);
        setVpTracks(vpTracksData.results || []);
        setTotalPages(Math.ceil(vpTracksData.count / 10)); // Assuming 10 items per page
      } catch (error) {
        console.error("Error fetching VP Tracks:", error);
        setVpTracks([]);
      }
    };

    loadCompaniesAndEmployees();
    loadVPTracks();
  }, [currentPage]);

  const handleCompanyChange = (value) => {
    setCompany(value);
    const selected = companies.find(c => c.id.toString() === value);
    setSelectedCompany(selected);
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

  const handleVpTrackAdd = async (e) => {
    e.preventDefault();
    const newVPTrack = {
      company,
      employee,
      computer_card: computerCard,
      nation,
      vp_no: vpNo,
      vp_expiry: vpExpiry.toISOString().split("T")[0],
      employee_designation: employeeDesignation,
      visa_count: visaCount,
    };

    try {
      const response = await api.post('/vptracks/', newVPTrack);
      toast({
        title: "Success",
        description: "VPTracks added successfully.",
      })
      resetForm();
      // Refresh the VP Tracks list
      const vpTracksData = await fetchVPTrackingList(currentPage);
      setVpTracks(vpTracksData.results || []);
    } catch (error) {
      console.error("Error adding VP Track:", error);
      toast({
        title: "Error",
        description: "Failed to adding VP Track.",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setCompany("");
    setSelectedCompany("");
    setEmployee("");
    setComputerCard("");
    setNation("");
    setVpNo("");
    setVpExpiry(undefined);
    setEmployeeDesignation("");
    setVisaCount("");
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <main className="w-full h-full bg-white rounded-md p-2">
      <section className="w-full p-2 flex justify-center">
        <div className="w-full">
          <div className="w-full border rounded-xl p-4 shadow-md ">
            <div className="w-full">
              <h1 className="font-semibold text-[20px]">Add VP tracking</h1>
            </div>
            <form action="" className="w-full mt-3" onSubmit={handleVpTrackAdd}>
              {/* First row */}
              <div className="w-full grid grid-cols-1 md:grid-cols-4 gap-3 mb-3">
                {/* Company Selection */}
                <div className="flex flex-col gap-1">
                  <label htmlFor="" className="text-sm">Select Company</label>
                  <Select value={company} onValueChange={handleCompanyChange}>
                    <SelectTrigger className="w-full bg-white">
                      <SelectValue placeholder="Select Company" />
                    </SelectTrigger>
                    <SelectContent>
                      {companies.map((company) => (
                        <SelectItem key={company.id} value={company.id.toString()}>
                          {company.company_name}
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
              </div>

              {/* Second row */}
              <div className="w-full grid grid-cols-1 md:grid-cols-4 gap-3">
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
                    value={vpExpiry?.toISOString().split("T")[0] || ""}
                    onChange={(e) => setVpExpiry(new Date(e.target.value))}
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
                    onChange={(e) => setVisaCount(Number(e.target.value))}
                    type="number"
                    className="w-full bg-white"
                    placeholder="Visa count"
                  />
                </div>
              </div>

              <div className="mt-3 flex justify-end">
                <Button type="submit">Submit</Button>
              </div>
            </form>
          </div>
        </div>
      </section>
      <section className="w-full p-2 flex justify-center">
        <div className="w-full border rounded-xl p-4 shadow-md ">
          <VPTable 
            data={vpTracks} 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </section>
    </main>
  );
}
