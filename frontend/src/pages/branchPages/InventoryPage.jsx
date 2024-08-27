import { BranchProductsTable } from "@/components/branch/BranchProductsTable";
import Layout from "@/components/layout/Layout";
import React from "react";

const InventoryPage = () => {
  return (
    <Layout>
      <h1 className="font-semibold text-2xl">Inventory Products</h1>
      <BranchProductsTable />
    </Layout>
  );
};

export default InventoryPage;
