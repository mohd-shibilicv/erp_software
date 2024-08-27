import { BranchProductRequestsTable } from "@/components/branch/BranchProductRequestsTable";
import Layout from "@/components/layout/Layout";
import React from "react";

const ProductRequestsPage = () => {
  return (
    <Layout>
      <h1 className="font-semibold text-2xl">Branch Product Requests</h1>
      <BranchProductRequestsTable />
    </Layout>
  );
};

export default ProductRequestsPage;
