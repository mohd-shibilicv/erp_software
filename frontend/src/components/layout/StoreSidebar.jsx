"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useLocation, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, ChevronDown, MenuIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Tabs } from "@/components/ui/tabs";
import LogoutBtn from "./LogoutBtn";
import { useTheme } from "../ui/them-provider";

// Import all icons
import * as Icons from "lucide-react";
import { api } from "@/services/api";

const UpdatedStoreSidebar = () => {
  const location = useLocation();
  const [expandedSections, setExpandedSections] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const { theme, setTheme } = useTheme();
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    const fetchSidebarConfig = async () => {
      try {
        const response = await api.get("/sidebar-config/");
        setMenuItems(response.data);
      } catch (error) {
        console.error("Failed to fetch sidebar configuration:", error);
      }
    };

    fetchSidebarConfig();
  }, []);

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

  const renderMenuItem = (item) => {
    const IconComponent = Icons[item.icon] || Icons.FileText;

    return (
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
          <IconComponent className="w-5 h-5" />
          <span>{item.label}</span>
        </Link>
      </motion.div>
    );
  };

  // Define the desired order for each section
  const sectionOrder = {
    CRM: ["CRM Dashboard", "Client Requests", "Client Relationship", "Client Requirements", "Quotation", "Agreement"],
    Transactions: ["Purchase Request", "Local Purchase Order", "Purchase", "Purchase Return", "Sales Order", "Sales", "Sales Return", "Join Venture Sales", "Receipt Voucher", "Payment Voucher", "Invoice"],
    "Project Management": ["Projects", "Tasks", "Delivery Note"],
    "Product Management": ["Dashboard", "Products", "Suppliers"],
    Users: ["Managers", "Staff"],
    Inventory: ["Product Inflows", "Product Requests", "Product Outflows", "Defective Products"],
    Reports: ["Reports", "Sales", "Join Venture Sales"],
    Operations: ["Product Grouping", "Physical Stock", "Material Transfer", "Invoice Generator", "Group Mailing"],
    "Employee Management": ["Employee Dashboard", "Employees", "Attendance", "Leave / Vacation", "Vp Track", "Uniform Report", "Reports"],
    "Asset Management": ["Assets Dashboard", "Asset Creation", "Asset Transfer", "Asset Depreciation", "Asset Service", "Asset Reports"],
    "Company Management": ["Company Dashboard", "Company List", "Company", "Branches", "Vehicle List", "Add Vehicle", "Vehicle Expense", "AMC Contract", "Rental Expense", "Reports"],
    Accounts: ["Ledger"],
  };

  const renderSection = (section) => {
    // Sort the items based on the predefined order
    const sortedItems = section.items.sort((a, b) => {
      const orderA = sectionOrder[section.section]?.indexOf(a.label) ?? Infinity;
      const orderB = sectionOrder[section.section]?.indexOf(b.label) ?? Infinity;
      return orderA - orderB;
    });

    return (
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
                {sortedItems.map(renderMenuItem)}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  const filteredMenuItems = menuItems.filter((item) => {
    if (user?.role === "staff") {
      // Only allow staff to access specific sections
      return ["Tasks", "CRM"].includes(item.section);
    }
    if (user?.role === "admin") {
      // Exclude "Tasks" section for admin roles
      return item.section !== "Tasks";
    }
    // For other roles, show all menu items except "Tasks"
    return item.section !== "Tasks";
  });

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
    {/* Theme toggle implementation */}
  </Tabs>
);

export default UpdatedStoreSidebar;
