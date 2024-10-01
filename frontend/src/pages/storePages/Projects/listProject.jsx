/* eslint-disable react-hooks/rules-of-hooks */
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";

import { Plus } from "lucide-react";

import { useGetAllProject } from "@/hooks/useGetProjects";

import ProjectTable from "./ProjectTab";

export default function ProjectsPage() {
  const navigate = useNavigate();

  const [showState, setShowState] = useState("all");
  const { data: projects = [], isLoading: loading } =
    useGetAllProject(showState);

  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <div className="container mx-auto py-10 bg-white rounded-md">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Project list</h1>
        <Button onClick={() => navigate("/admin/project/new")}>
          <Plus className="mr-2 h-4 w-4" /> Add New Project
        </Button>
      </div>
      <div className="flex items-center py-4"></div>
      <div className="hidden" id="StateShowBox">
        {showState}
      </div>

      <ProjectTable
        data={projects}
        showState={showState}
        setShowState={setShowState}
      />
    </div>
  );
}
