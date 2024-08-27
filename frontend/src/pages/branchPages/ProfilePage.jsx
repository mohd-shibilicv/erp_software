import React from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import BranchDetailsForm from "@/components/branch/BranchDetailsForm";
import Layout from "@/components/layout/Layout";
import BranchManagerForm from "@/components/branch/BranchManagerForm";

const ProfilePage = () => {
  return (
    <Layout>
      <Tabs defaultValue="branch" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="branch">Branch Profile</TabsTrigger>
          <TabsTrigger value="manager">Manager Profile</TabsTrigger>
        </TabsList>
        <TabsContent value="branch">
          <BranchDetailsForm />
        </TabsContent>
        <TabsContent value="manager">
          <BranchManagerForm />
        </TabsContent>
      </Tabs>
    </Layout>
  );
};

export default ProfilePage;
