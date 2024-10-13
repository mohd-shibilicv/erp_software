import React, { useState, useEffect } from "react";
import { api } from "@/services/api";

const MainGroupAddEditModal = ({ isOpen, onClose, onSuccess, editGroup }) => {
  const [natureGroups, setNatureGroups] = useState([]);
  const [newMainGroup, setNewMainGroup] = useState({
    name: "",
    nature_group_id: "",
  });

  useEffect(() => {
    if (isOpen) {
      api
        .get("/nature-groups")
        .then((response) => {
          const { results } = response.data;
          setNatureGroups(results);
        })
        .catch((error) => {
          console.error("Error fetching nature groups:", error);
        });

     
      if (editGroup) {
        setNewMainGroup({
          name: editGroup.name,
          nature_group_id: editGroup.nature_group.id, 
        });
      } else {
        
        setNewMainGroup({
          name: "",
          nature_group_id: "",
        });
      }
    }
  }, [isOpen, editGroup]); 

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMainGroup((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newMainGroup.nature_group_id) {
      console.error("Nature Group is required");
      return;
    }

    const apiCall = editGroup
      ? api.put(`/main-groups/${editGroup.id}/`, newMainGroup) 
      : api.post("/main-groups/", newMainGroup); 

    apiCall
      .then((response) => {
        onSuccess(); 
        onClose();
      })
      .catch((error) => {
        console.error("Error creating/updating main group:", error);
      });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
        <h3 className="text-lg font-bold mb-4">
          {editGroup ? "Edit Main Group" : "Create Main Group"}
        </h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2">Main Group Name</label>
            <input
              type="text"
              name="name"
              value={newMainGroup.name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Nature Group</label>
            <select
              name="nature_group_id" // Change name to nature_group_id
              value={newMainGroup.nature_group_id} // Update to match state
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded"
              required
            >
              <option value="">Select Nature Group</option>
              {natureGroups.map((natureGroup) => (
                <option key={natureGroup.id} value={natureGroup.id}>
                  {natureGroup.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white py-2 px-4 rounded mr-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-4 rounded"
            >
              {editGroup ? "Update" : "Create"} {/* Change button text */}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MainGroupAddEditModal;
