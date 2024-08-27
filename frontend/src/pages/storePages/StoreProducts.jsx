import Layout from "@/components/layout/Layout";
import { ProductsTable } from "@/components/store/ProductsTable";
import React from "react";

const StoreProducts = () => {
  return (
    <Layout>
      <h1 className="font-semibold text-2xl">Products</h1>
      <ProductsTable />
    </Layout>
  );
};

export default StoreProducts;
