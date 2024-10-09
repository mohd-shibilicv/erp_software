import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Outlet, useLocation, useNavigate } from "react-router-dom";

export default function EmployeeLayouts() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const employeRoueKeys = {
    "/employee-mangement": "dashboard",
    "/employee-mangement/add-employee": "add-employee",
    "/employee-mangement/employee-list": "employee-list",
    "/employee-mangement/leave-vacation": "leave-vacation",
    "/employee-mangement/vp-track": "vp-track",
    "/employee-mangement/uniform-report": "uniform-report",
    "/employee-mangement/reports": "reports",
  };
  return (
    <main className="w-full h-full bg-white rounded-md p-2">
      <div className="relative">
        <div className="w-full hidden lg:block sticky top-0 z-10 left-0">
          <Tabs
            defaultValue={employeRoueKeys[pathname]}
            className="w-full flex flex-wrap "
          >
            <TabsList className="bg-gray-200 w-full">
              <TabsTrigger
                onClick={() => navigate("/employee-mangement")}
                className="w-full"
                value="dashboard"
              >
                Dashboard
              </TabsTrigger>
              <TabsTrigger
                onClick={() => navigate("add-employee")}
                className="w-full"
                value="add-employee"
              >
                Add-Employee
              </TabsTrigger>
              <TabsTrigger
                onClick={() => navigate("employee-list")}
                className="w-full"
                value="employee-list"
              >
                Employee-list
              </TabsTrigger>
              <TabsTrigger
                onClick={() => navigate("leave-vacation")}
                className="w-full"
                value="leave-vacation"
              >
                Leave-vacation
              </TabsTrigger>
              <TabsTrigger
                onClick={() => navigate("vp-track")}
                className="w-full"
                value="vp-track"
              >
                Vp-track
              </TabsTrigger>
              <TabsTrigger
                onClick={() => navigate("uniform-report")}
                className="w-full"
                value="uniform-report"
              >
                Uniform-report
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
