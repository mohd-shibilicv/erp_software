import { ProductRequestsTable } from "@/components/store/ProductRequestsTable";
import Layout from "@/components/layout/Layout";
import React from "react";

const ProductRequestsPage = () => {
  return (
    <Layout>
      <h1 className="font-semibold text-2xl">All Product Requests</h1>
      <ProductRequestsTable />
    </Layout>
  );
};

export default ProductRequestsPage;
