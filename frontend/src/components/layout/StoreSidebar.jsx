import React, { useState } from "react";
import { useSelector } from "react-redux";
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
  User,
  UserCog,
  CalendarArrowDown,
  LayoutList,
  MenuIcon,
  Sun,
  Moon,
} from "lucide-react";
import LogoutBtn from "./LogoutBtn";
import StoreSideBarSheet from "./StoreSidebarSheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { useTheme } from "../ui/them-provider";

const StoreSidebar = () => {
  const location = useLocation();
  const [expandedSections, setExpandedSections] = useState({});
  const { user } = useSelector((state) => state.auth);
  const { theme, setTheme } = useTheme();
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
        { path: "/admin", icon: LayoutDashboard, label: "Dashboard" },
        { path: "/admin/products", icon: PackageSearch, label: "Products" },
        { path: "/admin/suppliers", icon: Truck, label: "Suppliers" },
        { path: "/admin/branches", icon: Warehouse, label: "Branches" },
      ],
    },
    {
      section: "Users",
      items: [
        {
          path: "/admin/managers",
          icon: UserCog,
          label: "Managers",
        },
        { path: "/admin/staff", icon: User, label: "Staff" },
      ],
    },
    {
      section: "Inventory",
      items: [
        {
          path: "/admin/damaged-products",
          icon: HeartCrack,
          label: "Damaged Products",
        },
        {
          path: "/admin/product-requests",
          icon: PhoneIncoming,
          label: "Product Requests",
        },
        {
          path: "/admin/product-inflow",
          icon: ArrowDownToDot,
          label: "Product Inflows",
        },
        {
          path: "/admin/product-outflow",
          icon: ArrowUpFromDot,
          label: "Product Outflows",
        },
      ],
    },
    {
      section: "Reports",
      items: [
        { path: "/admin/reports", icon: Layers3, label: "Reports" },
        { path: "/admin/sales", icon: Sheet, label: "Sales" },
        { path: "/admin/van-sales", icon: NotebookText, label: "Van Sales" },
      ],
    },
    {
      section: "Operations",
      items: [
        { path: "/admin/packing", icon: Package, label: "Packing" },
        {
          path: "/admin/physical-stock",
          icon: Blocks,
          label: "Physical Stock",
        },
        {
          path: "/admin/material-transfer",
          icon: Replace,
          label: "Material Transfer",
        },
        {
          path: "/admin/invoice-generator",
          icon: FileText,
          label: "Invoice Generator",
        },
      ],
    },
    {
      section: "Transactions",
      items: [
        {
          path: "/admin/add-payment-transaction",
          icon: CreditCard,
          label: "Add Payment",
        },
        {
          path: "/admin/add-receipt-voucher",
          icon: ReceiptText,
          label: "Add Receipt",
        },
        { path: "/admin/invoice", icon: StickyNote, label: "Invoice" },
        { path: "/admin/job-order", icon: SendToBack, label: "Job Order" },
        {
          path: "/admin/delivery-note",
          icon: NotebookPen,
          label: "Delivery Note",
        },
      ],
    },
    {
      section: "CRM",
      items: [
        {
          path: "/admin/client-request",
          icon: CalendarArrowDown,
          label: "Client Requests",
        },
        {
          path: "/admin/client-relationship",
          icon: Contact,
          label: "Client Relationship",
        },
        {
          path: "/admin/client-requirements",
          icon: Headset,
          label: "Client Requirements",
        },
        { path: "/admin/quotation", icon: Handshake, label: "Quotation" },
        { path: "/admin/agreement", icon: Signature, label: "Agreement" },
      ],
    },
    {
      section: "Job Order",
      items: [
        {
          path: "/admin/projects",
          icon: LayoutList,
          label: "Projects",
        },
        // {
        //   path: "/admin/client-relationship",
        //   icon: Contact,
        //   label: "Client Relationship",
        // },
        // {
        //   path: "/admin/client-requirements",
        //   icon: Headset,
        //   label: "Client Requirements",
        // },
        // { path: "/admin/quotation", icon: Handshake, label: "Quotation" },
        // { path: "/admin/agreement", icon: Signature, label: "Agreement" },
      ],
    },
  ];

  const filteredMenuItems =
    user?.role === "staff"
      ? menuItems.filter((item) => item.section === "CRM")
      : menuItems;

  const renderMenuItem = (item) => (
    <Link
      key={item.path}
      to={item.path}
      className={`flex items-center space-x-2 p-2 rounded ${isActive(
        item.path
      )}`}
    >
      <item.icon className="w-6 h-6" />
      <span className="hidden md:inline ">{item.label}</span>
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
        <ul className="ml-2 space-y-1 transition-all duration-300">
          {section.items.map(renderMenuItem)}
        </ul>
      )}
    </div>
  );

  return (
    <div className="relative">
      <StoreSideBarSheet menuItems={menuItems} />
      <div
        className={
          "bg-background p-4 h-screen border-r border-gray-300 lg:flex flex-col transition-all duration-300 w-64 hidden "
        }
      >
        <div className="flex justify-between items-center mb-8 ">
          <Link to="/" className="flex justify-center">
            <img
              src="/nasscript_full_banner_logo.png"
              alt="LOGO"
              className="h-10"
            />
          </Link>
        </div>
        <nav className="flex-grow overflow-y-auto custom-scrollbar">
          {filteredMenuItems.map(renderSection)}
        </nav>
        <div className="mt-2 pb-5">
          <ul>
            <Tabs defaultValue={theme} className="w-full mb-2 hidden ">
              <TabsList className="bg-gray-200 w-full px-1 ">
                <TabsTrigger
                  onClick={() => setTheme("light")}
                  className="w-full flex items-center gap-2 h-[95%]"
                  value="light"
                >
                  <Sun className="w-4" />
                  Light
                </TabsTrigger>
                <TabsTrigger
                  onClick={() => setTheme("dark")}
                  className="w-full flex items-center gap-2 h-[95%]"
                  value="dark"
                >
                  <Moon className="w-4" />
                  Dark
                </TabsTrigger>
              </TabsList>
            </Tabs>
            <Link
              to="/admin/notifications"
              className={`flex items-center space-x-2 p-2 rounded ${isActive(
                "/admin/notifications"
              )}`}
            >
              <Bell className="w-6 h-6" />
              <span className="hidden sm:inline">Notifications</span>
            </Link>
            <LogoutBtn />
          </ul>
        </div>
      </div>
    </div>
  );
};

export default StoreSidebar;
