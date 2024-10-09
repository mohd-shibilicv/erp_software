/* eslint-disable react/prop-types */
"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useLocation, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  LayoutDashboard,
  PackageSearch,
  Truck,
  Warehouse,
  ArrowDownToDot,
  ArrowUpFromDot,
  Layers3,
  HeartCrack,
  PhoneIncoming,
  SheetIcon,
  NotebookText,
  Package,
  Blocks,
  Replace,
  Handshake,
  FileText,
  ChevronDown,
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
  ClipboardCheck,
  ListTodo,
  MenuIcon,
  X,
  FilePlus,
  Building,
  RefreshCcw,
  TrendingDown,
  Wrench,
  UserPlus,
  UsersRound,
  PlaneTakeoff,
  PencilRuler,
  Shirt,
  ChartNoAxesCombined,
  Building2,
  HousePlus,
  Bus,
  Ambulance,
  FileChartLine,
  ShieldAlert,
  ChartScatter,
  ChartNoAxesCombinedIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Tabs } from "@/components/ui/tabs";
import LogoutBtn from "./LogoutBtn";
import { useTheme } from "../ui/them-provider";

const StoreSidebar = () => {
  const location = useLocation();
  const [expandedSections, setExpandedSections] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const { theme, setTheme } = useTheme();

  const isActive = (path) => {
    return location.pathname === path
      ? "bg-[#6f42c1] text-white"
      : "hover:bg-[#6f42c1]/10 hover:text-[#6f42c1]";
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
      ],
    },
    {
      section: "Users",
      items: [
        { path: "/admin/managers", icon: UserCog, label: "Managers" },
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
        { path: "/admin/sales", icon: SheetIcon, label: "Sales" },
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
        {
          path: "/admin/group-mailing",
          icon: FileText,
          label: "Group Mailing",
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
    user.role === "staff"
      ? {
          section: "Tasks",
          items: [
            { path: "/admin/staff-tasks", icon: ListTodo, label: "Tasks" },
          ],
        }
      : null,
    {
      section: "Job Order",
      items: [
        {
          path: "/admin/projects",
          icon: LayoutList,
          label: "Projects",
        },
        {
          path: "/admin/tasks",
          icon: ClipboardCheck,
          label: "Tasks",
        },
      ],
    },
    {
      section: "Employee Management",
      items: [
        {
          path: "/admin/employee-mangement",
          icon: LayoutDashboard,
          label: "Employee Dashboard",
        },
        {
          path: "/admin/employee-mangement/add-employee",
          icon: UserPlus,
          label: "Add Employee",
        },
        {
          path: "/admin/employee-mangement/employee-list",
          icon: UsersRound,
          label: "Employee list",
        },
        {
          path: "/admin/employee-mangement/leave-vacation",
          icon: PlaneTakeoff,
          label: "Leave Vacation",
        },
        {
          path: "/admin/employee-mangement/vp-track",
          icon: PencilRuler,
          label: "Vp Track",
        },
        {
          path: "/admin/employee-mangement/uniform-report",
          icon: Shirt,
          label: "Uniform Report",
        },
        {
          path: "/admin/employee-mangement/reports",
          icon: ChartNoAxesCombined,
          label: "Reports",
        },
      ],
    },
    {
      section: "Asset Management",
      items: [
        {
          path: "/admin/assets-dashboard",
          icon: LayoutDashboard,
          label: "Assets Dashboard",
        },
        {
          path: "/admin/asset-creation",
          icon: FilePlus,
          label: "Asset Creation",
        },
        // {
        //   path: "/admin/branch-creation",
        //   icon: Building,
        //   label: "Branch Creation",
        // },
        {
          path: "/admin/asset-transfer",
          icon: RefreshCcw,
          label: "Asset Transfer",
        },
        {
          path: "/admin/asset-depreciation",
          icon: TrendingDown,
          label: "Asset Depreciation",
        },
        { path: "/admin/asset-service", icon: Wrench, label: "Asset Service" },
        {
          path: "/admin/asset-reports",
          icon: FileText,
          label: "Asset Reports",
        },
      ],
    },
    {
      section: "Company Management",
      items: [
        {
          path: "/admin/company-management",
          icon: LayoutDashboard,
          label: "Company Dashboard",
        },
        {
          path: "/admin/company-management/company-list",
          icon: Building2,
          label: "Company List",
        },
        {
          path: "/admin/company-management/add-company",
          icon: HousePlus,
          label: "Company",
        },
        { path: "/admin/branches", icon: Warehouse, label: "Branches" },
        {
          path: "/admin/company-management/vehicle-list",
          icon: Bus,
          label: "Vehicle List",
        },
        {
          path: "/admin/company-management/add-vehicle",
          icon: Ambulance,
          label: "Add Vehicle",
        },
        {
          path: "/admin/company-management/vehicle-expense",
          icon: FileChartLine,
          label: "Vehicle Expense",
        },
        {
          path: "/admin/company-management/fire-certification",
          icon: ShieldAlert,
          label: "Fire and Certificate",
        },
        {
          path: "/admin/company-management/rent-expense",
          icon: ChartScatter,
          label: "Rent and Expense",
        },
        {
          path: "/admin/company-management/reports",
          icon: ChartNoAxesCombinedIcon ,
          label: "Reports",
        },
      ],
    },
  ].filter(Boolean);

  const filteredMenuItems =
    user?.role === "staff"
      ? menuItems.filter((item) => ["CRM", "Tasks"].includes(item.section))
      : menuItems;

  const renderMenuItem = (item) => (
    <motion.div
      key={item.path}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
    >
      <Link
        to={item.path}
        className={`flex items-center space-x-2 p-2 rounded-[5px] transition-colors duration-200 ${isActive(
          item.path
        )}`}
        onClick={() => setIsOpen(false)}
      >
        <item.icon className="w-5 h-5" />
        <span>{item.label}</span>
      </Link>
    </motion.div>
  );

  const renderSection = (section) => (
    <div key={section.section} className="mb-4">
      <Button
        variant="ghost"
        className="w-full justify-between"
        onClick={() => toggleSection(section.section)}
      >
        <span className="font-semibold">{section.section}</span>
        <motion.span
          animate={{ rotate: expandedSections[section.section] ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDown className="w-4 h-4" />
        </motion.span>
      </Button>
      <AnimatePresence>
        {expandedSections[section.section] && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="ml-4 mt-2 space-y-1">
              {section.items.map(renderMenuItem)}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        className="fixed left-4 top-4 z-50 lg:hidden"
        onClick={() => setIsOpen(true)}
      >
        <MenuIcon className="h-6 w-6" />
        <span className="sr-only">Open menu</span>
      </Button>

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent side="left" className="p-0 w-[300px]">
          <MobileSidebar
            filteredMenuItems={filteredMenuItems}
            renderSection={renderSection}
            theme={theme}
            setTheme={setTheme}
            setIsOpen={setIsOpen}
          />
        </SheetContent>
      </Sheet>

      <div className="hidden lg:flex flex-col h-screen w-64 bg-background border-r border-border">
        <DesktopSidebar
          filteredMenuItems={filteredMenuItems}
          renderSection={renderSection}
          theme={theme}
          setTheme={setTheme}
        />
      </div>
    </>
  );
};

const MobileSidebar = ({
  filteredMenuItems,
  renderSection,
  theme,
  setTheme,
  setIsOpen,
}) => (
  <motion.div
    initial={{ opacity: 0, x: -50 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -50 }}
    transition={{ duration: 0.3 }}
    className="flex flex-col h-full"
  >
    <div className="flex justify-between items-center p-4 border-b">
      <Link
        to="/"
        className="flex items-center space-x-2"
        onClick={() => setIsOpen(false)}
      >
        <img src="/nasscript_full_banner_logo.png" alt="LOGO" className="h-8" />
      </Link>
      <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
        <X className="h-6 w-6" />
        <span className="sr-only">Close menu</span>
      </Button>
    </div>
    <ScrollArea className="flex-grow">
      <div className="p-4 space-y-4">
        {filteredMenuItems.map(renderSection)}
      </div>
    </ScrollArea>
    <div className="p-4 border-t">
      <ThemeToggle theme={theme} setTheme={setTheme} />
      <Link
        to="/admin/notifications"
        className="flex items-center space-x-2 p-2 rounded-md hover:bg-accent mt-2"
        onClick={() => setIsOpen(false)}
      >
        <Bell className="w-5 h-5" />
        <span>Notifications</span>
      </Link>
      <LogoutBtn onClick={() => setIsOpen(false)} />
    </div>
  </motion.div>
);

const DesktopSidebar = ({
  filteredMenuItems,
  renderSection,
  theme,
  setTheme,
}) => (
  <>
    <div className="flex justify-center items-center h-16 border-b">
      <Link to="/" className="flex items-center space-x-2">
        <img
          src="/nasscript_full_banner_logo.png"
          alt="LOGO"
          className="h-10"
        />
      </Link>
    </div>
    <ScrollArea className="flex-grow">
      <nav className="p-4 space-y-4">
        {filteredMenuItems.map(renderSection)}
      </nav>
    </ScrollArea>
    <div className="p-4 border-t">
      <ThemeToggle theme={theme} setTheme={setTheme} />
      <Link
        to="/admin/notifications"
        className="flex items-center space-x-2 p-2 hover:bg-transparent hover:text-purple-600 rounded-[5px] mt-2"
      >
        <Bell className="w-5 h-5" />
        <span>Notifications</span>
      </Link>
      <LogoutBtn />
    </div>
  </>
);

const ThemeToggle = ({ theme, setTheme }) => (
  <Tabs defaultValue={theme} className="w-full">
    {/* <TabsList className="w-full">
      <TabsTrigger
        value="light"
        onClick={() => setTheme("light")}
        className="w-full"
      >
        <Sun className="w-4 h-4 mr-2" />
        Light
      </TabsTrigger>
      <TabsTrigger
        value="dark"
        onClick={() => setTheme("dark")}
        className="w-full"
      >
        <Moon className="w-4 h-4 mr-2" />
        Dark
      </TabsTrigger>
    </TabsList> */}
  </Tabs>
);

export default StoreSidebar;
