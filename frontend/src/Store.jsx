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
import Notifications from "./pages/storePages/Notifications";
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

function Store() {
  return (
    <>
      <Routes>
        <Route path="/" element={<StoreDashboardPage /> } />
        <Route path="/products" element={<StoreProducts /> } />
        <Route path="/suppliers" element={<Suppliers /> } />
        <Route path="/branches" element={<Branches /> } />
        <Route path="/damaged-products" element={<DamagedProductsPage /> } />
        <Route path="/product-requests" element={<ProductRequestsPage /> } />
        <Route path="/product-inflow" element={<ProductInflow /> } />
        <Route path="/product-outflow" element={<ProductOutflow /> } />
        <Route path="/reports" element={<StoreReports /> } />
        <Route path="/sales" element={<SalesPageComponent /> } />
        <Route path="/van-sales" element={<VanSalesComponent /> } />
        <Route path="/packing" element={<Packing /> } />
        <Route path="/physical-stock" element={<PhysicalStock /> } />
        <Route path="/material-transfer" element={<MaterialTransfer /> } />
        <Route path="/quotation" element={<Quotation /> } />
        <Route path="/add-payment-transaction" element={<AddPaymentTransaction /> } />
        <Route path="/add-receipt-voucher" element={<AddReceipt /> } />
        <Route path="/client-relationship" element={<ClientRelationshipPage /> } />
        <Route path="/notifications" element={<Notifications /> } />
        <Route path="*" element={<NotFound404 /> } />
        <Route path="/invoice" element={<InvoiceGenerator /> } />
      </Routes>
    </>
  );
}

export default Store;
