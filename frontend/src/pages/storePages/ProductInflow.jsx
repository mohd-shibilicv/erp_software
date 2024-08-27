import Layout from "@/components/layout/Layout";
import ProductInflowsTable from "@/components/store/ProductInflowsTable";
import React from "react";

const ProductInflow = () => {
  return (
    <Layout>
      <h1 className="font-semibold text-2xl">Product Inflows</h1>
      <ProductInflowsTable />
    </Layout>
  );
};

export default ProductInflow;
