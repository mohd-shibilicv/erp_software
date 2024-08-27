import Layout from "@/components/layout/Layout";
import ProductOutflowsTable from "@/components/store/ProductOutflowsTable";
import React from "react";

const ProductOutflow = () => {
  return (
    <Layout>
      <h1 className="font-semibold text-2xl">Product Outflows</h1>
      <ProductOutflowsTable />
    </Layout>
  );
};

export default ProductOutflow;
