import "./App.css";
import { Routes, Route } from "react-router-dom";
import StoreDashboardPage from "./pages/storePages/StoreDashboardPage";
import NotFound404 from "./components/layout/NotFound404";
import StoreProducts from "./pages/storePages/StoreProducts";
import Suppliers from "./pages/storePages/Suppliers";
import Branches from "./pages/storePages/Branches";
import ProductInflow from "./pages/storePages/ProductInflow";
import ProductOutflow from "./pages/storePages/ProductOutflow";
import StoreReports from "./pages/storePages/StoreReports";
import DamagedProductsPage from "./pages/storePages/DamagedProductsPage";
import ProductRequestsPage from "./pages/storePages/ProductRequestsPage";
import SalesPageComponent from "./components/sales/SalesPageComponent";
import VanSalesComponent from "./components/sales/VanSalesComponent";
import Packing from "./components/sales/Packing";
import PhysicalStock from "./components/sales/PhysicalStock";
import MaterialTransfer from "./components/sales/MaterialTransfer";
// import Quotation from "./components/sales/Quotation";
import InvoiceGenerator from "./components/invoice/InvoiceGenerator";
import AddPaymentTransaction from "./components/sales/AddPaymentTransaction";
import AddReceipt from "./components/sales/AddReceipt";
// import ClientRelationshipPage from "./pages/storePages/ClientRelationshipPage";
// import ClientRequirementsPage from "./pages/storePages/ClientRequirementsPage";
import AgreementAddEdit from "./pages/storePages/agreement/AgreementAddEdit";
import DeliveryNote from "./components/sales/DeliveryNote";
import JobOrder from "./components/sales/JobOrder";
import DemoRequestTable from "./pages/storePages/demoRequests/DemoRequestTable";
import NotificationsPage from "./pages/storePages/NotificationsPage";
import Managers from "./pages/storePages/userManagement/Managers";
import Staff from "./pages/storePages/userManagement/Staff";
import { StoreProtectedRoute } from "./components/layout/StoreProtectedRoute";
import ClientRelationshipList from "./pages/storePages/clientRelationships/ClientRelationshipList";
import ClientRelationshipDetails from "./pages/storePages/clientRelationships/ClientRelationshipDetails";
import { Toaster } from "./components/ui/toaster";
import ClientRequirementsList from "./pages/storePages/clientRequirements/ClientRequirementsList";
import ClientRequirementsDetails from "./pages/storePages/clientRequirements/ClientRequirementsDetails";
import ClientRequirementsAddEdit from "./pages/storePages/clientRequirements/ClientRequirementsAddEdit";
import AddEditQuotation from "./pages/storePages/quotation/AddEditQuotation";
import QuotationList from "./pages/storePages/quotation/QuotationList";
import QuotationDetails from "./pages/storePages/quotation/QuotationDetails";
import Ledger from "./pages/storePages/accounts/Ledger/Ledger";
import ClientAgreementList from "./pages/storePages/agreement/ClientAgreementList";
import ClientAgreementDetails from "./pages/storePages/agreement/ClientAgreementDetails";
import ProjectsPage from "./pages/storePages/Projects/listProject";
import AddnewProject from "./pages/storePages/Projects/addProject";
import ProjectDetailPage from "./pages/storePages/Projects/projectDetail";
import ListStaffAndTask from "./pages/storePages/TasksForSfaff/listStaffandTask";
import TaskAddEdit from "./pages/storePages/TasksForSfaff/TasksAddUpdate";
import StaffTaskLists from "./pages/staffPages/staffTaskLlist";
import AdminTaskDetails from "./pages/storePages/TasksForSfaff/AdminTaskdetail";
import StaffTaskDetail from "./pages/staffPages/staffTaskdetail";
import AssetsDashboard from "./components/asset-management/AssetsDashboardForm";
import AssetCreationForm from "./components/asset-management/AssetCreation";
import AssetTransferForm from "./components/asset-management/AssetTransferForm";
import AssetDepreciationForm from "./components/asset-management/AssetDepreciationForm";
import AssetServiceForm from "./components/asset-management/AssetServiceForm";
import AssetReports from "./components/asset-management/AssetReports";

import EmployeDashboard from "./pages/storePages/EmployeeManagment/EmployeDashboard";
import LeaveAndVacation from "./pages/storePages/EmployeeManagment/LeaveAndVacation";
import VpTrack from "./components/employee-management/vp-track/VPTrack";
import UniformReport from "./pages/storePages/EmployeeManagment/UniformReport";
import Reports from "./pages/storePages/EmployeeManagment/reports";
import CompanyLayouts from "./pages/storePages/CompanyManagement/CompanyLayouts/CompanyLayout";
import CompanyDashboard from "./pages/storePages/CompanyManagement/CompanyDashboard";
import { CompanyList } from "./pages/storePages/CompanyManagement/CompanyList";
import { AddCompany } from "./pages/storePages/CompanyManagement/AddCompany";
import { AddVehicle } from "./pages/storePages/CompanyManagement/Vehicle/AddVehicle";
import { VehicleList } from "./pages/storePages/CompanyManagement/Vehicle/VehiclesList";
import { VehicleExpense } from "./pages/storePages/CompanyManagement/VehicleExpense";
import { FireAndCertfication } from "./pages/storePages/CompanyManagement/fireandCertification";
import { RentandExpense } from "./pages/storePages/CompanyManagement/rentAndExpense";
import { CompanyReports } from "./pages/storePages/CompanyManagement/reports";
import GroupMailing from "./components/store/GroupMailing";
import CrmDashboard from "./components/store/CrmDashboard";
import { EmployeeTable } from "./components/employee-management/EmployeeTable";
import { EmployeeForm } from "./components/employee-management/EmployeeForm";
import AttendanceTable from "./components/employee-management/AttendanceTable";
import AttendanceForm from "./components/employee-management/AttendanceForm";
import LeaveForm from "./components/employee-management/LeaveForm";
import LeaveTable from "./components/employee-management/LeaveTable";
import PurchaseRequestsTable from "./components/transactions/PurchaseRequestsTable";
import LPOTable from "./components/transactions/LPOTable";
import PurchaseTable from "./components/transactions/PurchaseTable";
import PurchaseReturnTable from "./components/transactions/PurchaseReturnTable";
import Clients from "./components/client/Clients";
import SalesReturnTable from "./components/transactions/SalesReturnTable";
import SalesOrderTable from "./components/transactions/SalesOrderTable";
import { AnualManintananceCost } from "./pages/storePages/CompanyManagement/AnualManintanaceCost/AnualMaintananceCost";
import SalesTable from "./components/transactions/SalesTable";

function Store() {
  return (
    <>
      <Toaster />
      <Routes>
        <Route path="/" element={<StoreDashboardPage />} />

        <Route
          path="/products"
          element={
            <StoreProtectedRoute allowedRoles={["admin"]}>
              <StoreProducts />
            </StoreProtectedRoute>
          }
        />
        <Route
          path="/suppliers"
          element={
            <StoreProtectedRoute allowedRoles={["admin"]}>
              <Suppliers />
            </StoreProtectedRoute>
          }
        />
        <Route
          path="/branches"
          element={
            <StoreProtectedRoute allowedRoles={["admin"]}>
              <Branches />
            </StoreProtectedRoute>
          }
        />
        <Route
          path="/damaged-products"
          element={
            <StoreProtectedRoute allowedRoles={["admin"]}>
              <DamagedProductsPage />
            </StoreProtectedRoute>
          }
        />
        <Route
          path="/product-requests"
          element={
            <StoreProtectedRoute allowedRoles={["admin"]}>
              <ProductRequestsPage />
            </StoreProtectedRoute>
          }
        />
        <Route
          path="/product-inflow"
          element={
            <StoreProtectedRoute allowedRoles={["admin"]}>
              <ProductInflow />
            </StoreProtectedRoute>
          }
        />
        <Route
          path="/product-outflow"
          element={
            <StoreProtectedRoute allowedRoles={["admin"]}>
              <ProductOutflow />
            </StoreProtectedRoute>
          }
        />
        <Route
          path="/reports"
          element={
            <StoreProtectedRoute allowedRoles={["admin"]}>
              <StoreReports />
            </StoreProtectedRoute>
          }
        />
        <Route
          path="/van-sales"
          element={
            <StoreProtectedRoute allowedRoles={["admin"]}>
              <VanSalesComponent />
            </StoreProtectedRoute>
          }
        />

        {/* Operations */}
        <Route
          path="/packing"
          element={
            <StoreProtectedRoute allowedRoles={["admin"]}>
              <Packing />
            </StoreProtectedRoute>
          }
        />
        <Route
          path="/physical-stock"
          element={
            <StoreProtectedRoute allowedRoles={["admin"]}>
              <PhysicalStock />
            </StoreProtectedRoute>
          }
        />
        <Route
          path="/material-transfer"
          element={
            <StoreProtectedRoute allowedRoles={["admin"]}>
              <MaterialTransfer />
            </StoreProtectedRoute>
          }
        />
        <Route
          path="/invoice-generator"
          element={
            <StoreProtectedRoute allowedRoles={["admin"]}>
              <InvoiceGenerator />
            </StoreProtectedRoute>
          }
        />
        <Route
          path="/group-mailing"
          element={
            <StoreProtectedRoute allowedRoles={["admin"]}>
              <GroupMailing />
            </StoreProtectedRoute>
          }
        />

        {/* Transactions */}
        <Route
          path="/add-payment-transaction"
          element={
            <StoreProtectedRoute allowedRoles={["admin"]}>
              <AddPaymentTransaction />
            </StoreProtectedRoute>
          }
        />
        <Route
          path="/add-receipt-voucher"
          element={
            <StoreProtectedRoute allowedRoles={["admin"]}>
              <AddReceipt />
            </StoreProtectedRoute>
          }
        />
        <Route
          path="/purchase-request"
          element={
            <StoreProtectedRoute allowedRoles={["admin"]}>
              <PurchaseRequestsTable />
            </StoreProtectedRoute>
          }
        />
        <Route
          path="/lpo"
          element={
            <StoreProtectedRoute allowedRoles={["admin"]}>
              <LPOTable />
            </StoreProtectedRoute>
          }
        />
        <Route
          path="/purchase"
          element={
            <StoreProtectedRoute allowedRoles={["admin"]}>
              <PurchaseTable />
            </StoreProtectedRoute>
          }
        />
        <Route
          path="/purchase-return"
          element={
            <StoreProtectedRoute allowedRoles={["admin"]}>
              <PurchaseReturnTable />
            </StoreProtectedRoute>
          }
        />
        <Route
          path="/sales-order"
          element={
            <StoreProtectedRoute allowedRoles={["admin"]}>
              <SalesOrderTable />
            </StoreProtectedRoute>
          }
        />
        <Route
          path="/sales"
          element={
            <StoreProtectedRoute allowedRoles={["admin"]}>
              <SalesTable />
            </StoreProtectedRoute>
          }
        />
        <Route
          path="/sales-return"
          element={
            <StoreProtectedRoute allowedRoles={["admin"]}>
              <SalesReturnTable />
            </StoreProtectedRoute>
          }
        />

        {/* User Management */}
        <Route
          path="/clients"
          element={
            <StoreProtectedRoute allowedRoles={["admin"]}>
              <Clients />
            </StoreProtectedRoute>
          }
        />
        <Route
          path="/managers"
          element={
            <StoreProtectedRoute allowedRoles={["admin"]}>
              <Managers />
            </StoreProtectedRoute>
          }
        />
        <Route
          path="/staff"
          element={
            <StoreProtectedRoute allowedRoles={["admin"]}>
              <Staff />
            </StoreProtectedRoute>
          }
        />

        {/* Project Management */}
        <Route
          path="/job-order"
          element={
            <StoreProtectedRoute allowedRoles={["admin"]}>
              <JobOrder />
            </StoreProtectedRoute>
          }
        />
        <Route
          path="/delivery-note"
          element={
            <StoreProtectedRoute allowedRoles={["admin"]}>
              <DeliveryNote />
            </StoreProtectedRoute>
          }
        />
        <Route
          path="/projects"
          element={
            <StoreProtectedRoute allowedRoles={["admin"]}>
              <ProjectsPage />
            </StoreProtectedRoute>
          }
        />
        <Route
          path="/project/new"
          element={
            <StoreProtectedRoute allowedRoles={["admin"]}>
              <AddnewProject />
            </StoreProtectedRoute>
          }
        />
        <Route
          path="/project/edit/:id"
          element={
            <StoreProtectedRoute allowedRoles={["admin"]}>
              <AddnewProject />
            </StoreProtectedRoute>
          }
        />
        <Route
          path="/project/:id"
          element={
            <StoreProtectedRoute allowedRoles={["admin"]}>
              <ProjectDetailPage />
            </StoreProtectedRoute>
          }
        />
        <Route
          path="/tasks"
          element={
            <StoreProtectedRoute allowedRoles={["admin"]}>
              <ListStaffAndTask />
            </StoreProtectedRoute>
          }
        />
        <Route
          path="/tasks/new"
          element={
            <StoreProtectedRoute allowedRoles={["admin"]}>
              <TaskAddEdit />
            </StoreProtectedRoute>
          }
        />
        <Route
          path="/tasks/detail/:id"
          element={
            <StoreProtectedRoute allowedRoles={["admin"]}>
              <AdminTaskDetails />
            </StoreProtectedRoute>
          }
        />

        {/* Company Management */}
        <Route path="/company-management" element={<CompanyDashboard />} />
        <Route path="/add-company" element={<AddCompany />} />
        <Route path="/add-vehicle" element={<AddVehicle />} />
        <Route path="/vehicle-list" element={<VehicleList />} />
        <Route path="/vehicle-expense" element={<VehicleExpense />} />
        <Route path="/anual-maintanace-cost" element={<AnualManintananceCost />} />
        <Route path="/reports" element={<CompanyReports />} />
        {/* <Route path="/rent-expense" element={<RentandExpense />} /> */}
        {/* <Route path="/company-list" element={<CompanyList />} /> */}
        {/* <Route path="/fire-certification" element={<FireAndCertfication />} /> */}
        {/* <Route path="employee-list" element={<EmployeeList />} />
          <Route path="leave-vacation" element={<LeaveAndVacation />} />
          <Route path="vp-track" element={<VpTrack />} />
          <Route path="uniform-report" element={<UniformReport />} />
          <Route path="reports" element={<Reports />} /> */}

        {/* CRM */}
        <Route path="/crm-dashboard" element={<CrmDashboard />} />
        <Route path="/client-request" element={<DemoRequestTable />} />
        <Route
          path="/staff-tasks"
          element={
            <StoreProtectedRoute allowedRoles={["staff"]}>
              <StaffTaskLists />
            </StoreProtectedRoute>
          }
        />
        <Route path="/staff-tasks/detail/:id" element={<StaffTaskDetail />} />

        <Route
          path="/client-relationship"
          element={<ClientRelationshipList />}
        />
        <Route
          path="/client-relationship/new"
          element={<ClientRelationshipDetails />}
        />
        <Route
          path="/client-relationship/:id"
          element={<ClientRelationshipDetails />}
        />

        <Route
          path="/client-requirements"
          element={<ClientRequirementsList />}
        />
        <Route
          path="/client-requirements/new"
          element={<ClientRequirementsAddEdit />}
        />
        <Route
          path="/client-requirements/new/:id"
          element={<ClientRequirementsAddEdit />}
        />
        <Route
          path="/client-requirements/:id"
          element={<ClientRequirementsDetails />}
        />

        <Route path="/quotation" element={<QuotationList />} />
        <Route path="/quotation/:id" element={<QuotationDetails />} />
        <Route path="/quotation/new" element={<AddEditQuotation />} />

        <Route
          path="/quotation/new/:id"
          element={<AddEditQuotation isEditMode={true} />}
        />

        <Route path="/agreement" element={<ClientAgreementList />} />
        <Route path="/agreement/new" element={<AgreementAddEdit />} />
        <Route path="/agreement/new/:id" element={<AgreementAddEdit />} />
        <Route path="/agreement/:id" element={<ClientAgreementDetails />} />

        {/* Employee Management */}
        <Route path="/employee-dashboard" element={<EmployeDashboard />} />
        <Route path="/employees" element={<EmployeeTable />} />
        <Route path="/employees/new" element={<EmployeeForm />} />
        <Route path="/employees/:id" element={<EmployeeForm />} />
        <Route path="/attendance" element={<AttendanceTable />} />
        <Route path="/attendance/new" element={<AttendanceForm />} />
        <Route path="/attendance/:id" element={<AttendanceForm />} />
        <Route path="/leaves" element={<LeaveTable />} />
        <Route path="/leaves/new" element={<LeaveForm />} />
        <Route path="/leaves/:id" element={<LeaveForm />} />
        <Route path="/leave-vacation" element={<LeaveAndVacation />} />
        <Route path="/vp-track" element={<VpTrack />} />
        <Route path="/uniform-report" element={<UniformReport />} />
        <Route path="/reports" element={<Reports />} />

        {/* Asset Management */}
        <Route path="/assets-dashboard" element={<AssetsDashboard />} />
        <Route path="/asset-creation" element={<AssetCreationForm />} />
        {/* <Route path="/branch-creation" element={<BranchCreationForm />} /> */}
        <Route path="/asset-transfer" element={<AssetTransferForm />} />
        <Route path="/asset-depreciation" element={<AssetDepreciationForm />} />
        <Route path="/asset-service" element={<AssetServiceForm />} />
        <Route path="/asset-reports" element={<AssetReports />} />

        {/* Accounts */}
        <Route path="/ledger" element={<Ledger />} />

        <Route path="*" element={<NotFound404 />} />
      </Routes>
    </>
  );
}

export default Store;
