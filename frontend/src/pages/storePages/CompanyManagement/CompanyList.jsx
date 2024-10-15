import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { fetchCompanies } from "@/services/api"; 
import CompanyTable from "./CompanyTableColumns/CompanyTable";

export function CompanyList() {
  const [srch, setSrch] = useState("");
  const [companies, setCompanies] = useState([]); 

  useEffect(() => {
    getCompanies();
  }, []);

  const getCompanies = async () => {
    try {
      const data = await fetchCompanies();
      setCompanies(data.results); 
    } catch (error) {
      console.error("Error fetching companies:", error);
      // Handle error appropriately
    }
  };

  // Filter companies based on search input
  const filteredCompanies = companies.filter(company =>
    company.company_name.toLowerCase().includes(srch.toLowerCase())
  );
  
  return (
    <main className="w-full h-full bg-white rounded-md p-2">
      <section className="w-full">
        <div className="w-full flex justify-end">
          <Input
            value={srch}
            onChange={(e) => setSrch(e.target.value)}
            className="shadow-md md:w-[300px] w-full"
            placeholder="Search Company name"
          />
        </div>

        <CompanyTable
          from="company"
          data={filteredCompanies} 
          onCompanyUpdated={getCompanies}
        />
      </section>
    </main>
  );
}
