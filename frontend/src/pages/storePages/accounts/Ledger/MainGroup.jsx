import React, { useEffect, useState } from "react";
import MainGroupModal from "@/components/modals/ledger/MainGroupAddEditModal";
import { api } from "@/services/api";

const MainGroups = () => {
  const [mainGroups, setMainGroups] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editGroup, setEditGroup] = useState(null); // State for the group being edited

  const fetchMainGroups = () => {
    api
      .get(`/main-groups/?page=${currentPage}`)
      .then((response) => {
        setMainGroups(response.data.results);
        setTotalPages(Math.ceil(response.data.count / 10));
      })
      .catch((error) => {
        console.error("Error fetching main groups:", error);
      });
  };

  useEffect(() => {
    fetchMainGroups();
  }, [currentPage]);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const openModal = (group = null) => {
    setEditGroup(group); // Set the group to be edited, if any
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditGroup(null); // Reset the edit group on close
  };

  const handleSuccess = () => {
    fetchMainGroups(); 
    closeModal(); // Close the modal on success
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Main Groups</h2>

        <button
          onClick={() => openModal()} // Pass no argument to add a new group
          className="bg-blue-500 text-white py-2 px-4 rounded"
        >
          Add Main Group
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-md">
          <thead>
            <tr>
              <th className="py-2 px-4 bg-gray-200 text-left">Main Group</th>
              <th className="py-2 px-4 bg-gray-200 text-left">Nature Group</th>
              <th className="py-2 px-4 bg-gray-200 text-left">Actions</th> {/* New Actions column */}
            </tr>
          </thead>
          <tbody>
            {mainGroups.map((group) => (
              <tr key={group.id}>
                <td className="py-2 px-4 border-b">{group.name}</td>
                <td className="py-2 px-4 border-b">
                  {group.nature_group.name}
                </td>
                <td className="py-2 px-4 border-b">
                  <button
                    onClick={() => openModal(group)} // Pass the group to be edited
                    className="bg-yellow-500 text-white py-1 px-2 rounded"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between mt-4">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className="bg-gray-300 text-gray-700 py-2 px-4 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="bg-gray-300 text-gray-700 py-2 px-4 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      <MainGroupModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSuccess={handleSuccess}
        editGroup={editGroup} // Pass the current group to be edited
      />
    </div>
  );
};

export default MainGroups;
