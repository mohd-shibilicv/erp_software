import Layout from "@/components/layout/Layout";
import { ProductsTable } from "@/components/store/ProductsTable";
import React from "react";

const StoreProducts = () => {
  return (
    <div >
      <h1 className="font-semibold text-2xl">Products</h1>
      <ProductsTable />
    </div>
  );
};

export default StoreProducts;
