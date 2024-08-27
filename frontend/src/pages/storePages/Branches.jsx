import Layout from "@/components/layout/Layout";
import { BranchesTable } from "@/components/store/BranchesTable";
import React from "react";

const Branches = () => {
  return (
    <Layout>
      <h1 className="font-semibold text-2xl">Branches</h1>
      <BranchesTable />
    </Layout>
  );
};

export default Branches;
