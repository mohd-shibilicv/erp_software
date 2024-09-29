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
import Quotation from "./components/sales/Quotation";
import InvoiceGenerator from "./components/invoice/InvoiceGenerator";
import AddPaymentTransaction from "./components/sales/AddPaymentTransaction";
import AddReceipt from "./components/sales/AddReceipt";
import ClientRelationshipPage from "./pages/storePages/ClientRelationshipPage";
import ClientRequirementsPage from "./pages/storePages/ClientRequirementsPage";
import AgreementAddEdit from "./pages/storePages/agreement/AgreementAddEdit";
import Invoice from "./components/sales/Invoice";
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
import ClientAgreementList from "./pages/storePages/agreement/ClientAgreementList";
import ClientAgreementDetails from "./pages/storePages/agreement/ClientAgreementDetails";
import ProjectsPage from "./pages/storePages/Projects/listProject";
import AddnewProject from "./pages/storePages/Projects/addProject";
import ProjectDetailPage from "./pages/storePages/Projects/projectDetail";

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
          path="/sales"
          element={
            <StoreProtectedRoute allowedRoles={["admin"]}>
              <SalesPageComponent />
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
        <Route
          path="/invoice"
          element={
            <StoreProtectedRoute allowedRoles={["admin"]}>
              <Invoice />
            </StoreProtectedRoute>
          }
        />
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
          path="/notifications"
          element={
            <StoreProtectedRoute allowedRoles={["admin", "staff"]}>
              <NotificationsPage />
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
          path="/project/:id"
          element={
            <StoreProtectedRoute allowedRoles={["admin"]}>
              <ProjectDetailPage />
            </StoreProtectedRoute>
          }
        />

        <Route path="/client-request" element={<DemoRequestTable />} />

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

        <Route path="*" element={<NotFound404 />} />
      </Routes>
    </>
  );
}

export default Store;
