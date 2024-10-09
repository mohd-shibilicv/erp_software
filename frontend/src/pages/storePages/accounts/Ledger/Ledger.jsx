import React, { useState } from "react";
import LedgerInfo from "../Ledger/LedgerInfo";
import MainGroups from "../Ledger/MainGroup";
import { Button } from "@/components/ui/button";

const Ledger = () => {
  const [activeTab, setActiveTab] = useState("info");

  return (
    <div>
      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 mb-4">
        <Button
          variant={activeTab === "info" ? "default" : "outline"}
          onClick={() => setActiveTab("info")}
        >
          Ledger Info
        </Button>
        <Button
          variant={activeTab === "report" ? "default" : "outline"}
          onClick={() => setActiveTab("report")}
        >
          Main Groups
        </Button>
      </div>

      <div>
        {activeTab === "info" && <LedgerInfo />}
        {activeTab === "report" && <MainGroups />}
      </div>
    </div>
  );
};

export default Ledger;
