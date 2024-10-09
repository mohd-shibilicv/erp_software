import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Outlet, useLocation, useNavigate } from "react-router-dom";

export default function CompanyLayouts() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const companyRouteKeys = {
    "/admin/company-management": "dashboard",
    "/admin/company-management/company-list": "company-list",
    "/admin/company-management/add-company": "add-company",
    "/admin/company-management/add-vehicle": "add-vehicle",
    "/admin/company-management/vehicle-list": "vehicle-list",
    "/admin/company-management/vehicle-expense": "vehicle-expense",
    "/admin/company-management/fire-certification": "fire-certification",
    "/admin/company-management/rent-expense": "rent-expense",
    "/admin/company-management/reports": "reports",
  };
  return (
    <main className="w-full h-full bg-white rounded-md p-2">
      <div className="">
        <div className="w-full hidden xl:block sticky top-0 z-10">
          <Tabs
            defaultValue={companyRouteKeys[pathname]}
            className="w-full flex flex-wrap "
          >
            <TabsList className="bg-gray-200 w-full">
              <TabsTrigger
                onClick={() => navigate("/admin/company-management")}
                className="w-full"
                value="dashboard"
              >
                Dashboard
              </TabsTrigger>
              <TabsTrigger
                onClick={() => navigate("company-list")}
                className="w-full"
                value="company-list"
              >
                Company-List
              </TabsTrigger>
              <TabsTrigger
                onClick={() => navigate("add-company")}
                className="w-full"
                value="add-company"
              >
                Company
              </TabsTrigger>
              <TabsTrigger
                onClick={() => navigate("add-vehicle")}
                className="w-full"
                value="add-vehicle"
              >
                Add-Vehilce
              </TabsTrigger>
              <TabsTrigger
                onClick={() => navigate("vehicle-list")}
                className="w-full"
                value="vehicle-list"
              >
                Vehicle-list
              </TabsTrigger>
              <TabsTrigger
                onClick={() => navigate("vehicle-expense")}
                className="w-full"
                value="vehicle-expense"
              >
                Vehicle-expense
              </TabsTrigger>
              <TabsTrigger
                onClick={() => navigate("fire-certification")}
                className="w-full"
                value="fire-certification"
              >
                Fire-certification
              </TabsTrigger>
              <TabsTrigger
                onClick={() => navigate("rent-expense")}
                className="w-full"
                value="rent-expense"
              >
                Rent-Expense
              </TabsTrigger>
              <TabsTrigger
                onClick={() => navigate("reports")}
                className="w-full"
                value="reports"
              >
                Reports
              </TabsTrigger>
            </TabsList>
            {/* <TabsContent value="account">
              Make changes to your account here.
            </TabsContent>
            <TabsContent value="password">
              Change your password here.
            </TabsContent> */}
          </Tabs>
        </div>
        <div className="w-full p-1 border rounded-md mt-2">
          <Outlet />
        </div>
      </div>
    </main>
  );
}
