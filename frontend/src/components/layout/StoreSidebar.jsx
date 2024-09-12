import React, { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import {
  Bell,
  LayoutDashboard,
  PackageSearch,
  Truck,
  Warehouse,
  ArrowDownToDot,
  ArrowUpFromDot,
  Layers3,
  Container,
  HeartCrack,
  PhoneIncoming,
  Sheet,
  NotebookText,
  Package,
  Blocks,
  Replace,
  Handshake,
  FileText,
  ChevronDown,
  ChevronRight,
  Menu,
  CreditCard,
  ReceiptText,
  Contact,
  Headset,
  Signature,
  StickyNote,
  NotebookPen,
  SendToBack,
  CalendarArrowDown,
} from "lucide-react";
import LogoutBtn from "./LogoutBtn";


const StoreSidebar = () => {
  const location = useLocation();
  const [expandedSections, setExpandedSections] = useState({});

  const isActive = (path) => {
    return location.pathname === path
      ? "bg-[#6f42c1] text-white"
      : "hover:bg-[#5a329e] hover:text-white";
  };

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const menuItems = [
    {
      section: "Main",
      items: [
        { path: "/store", icon: LayoutDashboard, label: "Dashboard" },
        { path: "/store/products", icon: PackageSearch, label: "Products" },
        { path: "/store/suppliers", icon: Truck, label: "Suppliers" },
        { path: "/store/branches", icon: Warehouse, label: "Branches" },
      ],
    },
    {
      section: "Inventory",
      items: [
        {
          path: "/store/damaged-products",
          icon: HeartCrack,
          label: "Damaged Products",
        },
        {
          path: "/store/product-requests",
          icon: PhoneIncoming,
          label: "Product Requests",
        },
        {
          path: "/store/product-inflow",
          icon: ArrowDownToDot,
          label: "Product Inflows",
        },
        {
          path: "/store/product-outflow",
          icon: ArrowUpFromDot,
          label: "Product Outflows",
        },
      ],
    },
    {
      section: "Reports",
      items: [
        { path: "/store/reports", icon: Layers3, label: "Reports" },
        { path: "/store/sales", icon: Sheet, label: "Sales" },
        { path: "/store/van-sales", icon: NotebookText, label: "Van Sales" },
      ],
    },
    {
      section: "Operations",
      items: [
        { path: "/store/packing", icon: Package, label: "Packing" },
        {
          path: "/store/physical-stock",
          icon: Blocks,
          label: "Physical Stock",
        },
        {
          path: "/store/material-transfer",
          icon: Replace,
          label: "Material Transfer",
        },
        { path: "/store/invoice-generator", icon: FileText, label: "Invoice Generator" },
      ],
    },
    {
      section: "Transactions",
      items: [
        {
          path: "/store/add-payment-transaction",
          icon: CreditCard,
          label: "Add Payment",
        },
        {
          path: "/store/add-receipt-voucher",
          icon: ReceiptText,
          label: "Add Receipt",
        },
        { path: "/store/invoice", icon: StickyNote, label: "Invoice" },
        { path: "/store/job-order", icon: SendToBack, label: "Job Order" },
        { path: "/store/delivery-note", icon: NotebookPen, label: "Delivery Note" },
      ],
    },
    {
      section: "CRM",
      items: [
        {
          path: "/store/demo-request",
          icon: CalendarArrowDown,
          label: "Demo Requests",
        },
        {
          path: "/store/client-relationship",
          icon: Contact,
          label: "Client Relationship",
        },
        {
          path: "/store/client-requirements",
          icon: Headset,
          label: "Client Requirements",
        },
        { path: "/store/quotation", icon: Handshake, label: "Quotation" },
        { path: "/store/agreement", icon: Signature, label: "Agreement" },
      ],
    },
  ];

  const renderMenuItem = (item) => (
    <Link
      key={item.path}
      to={item.path}
      className={`flex items-center space-x-2 p-2 rounded ${isActive(
        item.path
      )}`}
    >
      <item.icon className="w-6 h-6" />
      <span className="hidden md:inline">{item.label}</span>
    </Link>
  );

  const renderSection = (section) => (
    <div key={section.section} className="mb-4 mr-2">
      <button
        onClick={() => toggleSection(section.section)}
        className="flex items-center justify-between w-full p-2 text-left text-gray-600 hover:bg-gray-100 rounded"
      >
        <span className={`font-semibold`}>{section.section}</span>
        {expandedSections[section.section] ? (
          <ChevronDown className="w-4 h-4" />
        ) : (
          <ChevronRight className="w-4 h-4" />
        )}
      </button>
      {expandedSections[section.section] && (
        <ul className="ml-2 space-y-1">{section.items.map(renderMenuItem)}</ul>
      )}
    </div>
  );

  return (
    <div
      className={
        "bg-white p-4 h-screen border-r border-gray-300 flex flex-col transition-all duration-300 w-64"
      }
    >
      <div className="flex justify-between items-center mb-8">
        <Link to="/" className="flex justify-center">
          <img
            src="/nasscript_full_banner_logo.png"
            alt="LOGO"
            className="h-10"
          />
        </Link>
      </div>
      <nav className="flex-grow overflow-y-auto custom-scrollbar">
        {menuItems.map(renderSection)}
      </nav>
      <div className="mt-2">
        <ul>
          <Link
            to="/store/notifications"
            className={`flex items-center space-x-2 p-2 rounded ${isActive(
              "/store/notifications"
            )}`}
          >
            <Bell className="w-6 h-6" />
            <span className="hidden sm:inline">Notifications</span>
          </Link>
          <LogoutBtn />
        </ul>
      </div>
    </div>
  );
};

export default StoreSidebar;
