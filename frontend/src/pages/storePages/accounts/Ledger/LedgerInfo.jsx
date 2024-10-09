import React, { useEffect, useState } from "react";
import { api } from "@/services/api";
import EditLedgerModal from "@/components/modals/ledger/EditLedgerModal";
import LedgerCreationModal from "@/components/modals/ledger/LedgerCreationModal";



const LedgerInfo = () => {
  const [ledgers, setLedgers] = useState([]);
  const [groups, setGroups] = useState([]);
  const [selectedLedger, setSelectedLedger] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    const fetchLedgers = async () => {
      try {
        const response = await api.get(`/ledgers/?page=${currentPage}&page_size=${itemsPerPage}`);
        setLedgers(response.data.results);
        setTotalPages(Math.ceil(response.data.count / 10)); // Assuming your API provides the total number of pages
      } catch (error) {
        console.error("There was an error fetching the ledgers!", error);
        setError("Could not load ledgers. Please try again later.");
      }
    };

    fetchLedgers();
  }, [currentPage]);

  useEffect(() => {
    const fetchAllGroups = async () => {
      let allGroups = [];
      let nextUrl = "/main-groups/";

      while (nextUrl) {
        try {
          const response = await api.get(nextUrl);
          allGroups = [...allGroups, ...response.data.results];
          nextUrl = response.data.next; // Update the next URL for pagination
        } catch (error) {
          console.error("There was an error fetching the groups!", error);
          setError("Could not load groups. Please try again later.");
          break;
        }
      }

      setGroups(allGroups);
    };

    fetchAllGroups();
  }, []);
console.log("totalpages",totalPages);

  const handleEdit = (ledger) => {
    setSelectedLedger(ledger);
    setIsEditModalOpen(true);
  };

  const EditcloseModal = () => {
    setIsEditModalOpen(false);
    setSelectedLedger(null);
  };

  const handleSave = (updatedLedger) => {
    setLedgers((prevLedgers) =>
      prevLedgers.map((ledger) =>
        ledger.id === updatedLedger.id ? updatedLedger : ledger
      )
    );
  
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const AddLedgeropenModal = () => {
    setIsModalOpen(true);
  };

  const AddLedgercloseModal = () => {
    setIsModalOpen(false);
  };

  const refreshLedgerOptions = async () => {
    try {
      const response = await api.get(`/ledgers/?page=${currentPage}&page_size=${itemsPerPage}`);
      setLedgers(response.data.results); // Update the ledger list
      setTotalPages(Math.ceil(response.data.count / itemsPerPage)); // Update the total pages
    } catch (error) {
      console.error("Error refreshing ledgers:", error);
      setError("Could not refresh ledgers. Please try again later.");
    }
  };
  

  return (
    <div className="overflow-x-auto max-h-screen">
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
        <h1 className="text-2xl font-bold mb-2 sm:mb-0">Ledger</h1>
        <button
          className="bg-[#6f42c1] text-white py-2 px-4 rounded w-full sm:w-auto hover:bg-purple-700"
          onClick={AddLedgeropenModal}
        >
          Create Ledger
        </button>
      </div>
      <table className="min-w-full  bg-white shadow-md rounded-md">
        <thead>
          <tr>
            <th className="py-2 px-4 bg-gray-200 text-left">Id</th>
            <th className="py-2 px-4 bg-gray-200 text-left">Name</th>
            <th className="py-2 px-4 bg-gray-200 text-left">Group</th>
            <th className="py-2 px-4 bg-gray-200 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {ledgers.map((ledger) => (
            <tr key={ledger.id} className="align-top">
              <td className="py-2 px-4">{ledger.id}</td>
              <td className="py-2 px-4">{ledger.name}</td>
              <td className="py-2 px-4">{ledger.group.name}</td>
              <td className="py-2 px-4">
                <button
                  onClick={() => handleEdit(ledger)}
                  className="bg-blue-500 text-white py-1 px-2 rounded hover:bg-blue-700"
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4 flex flex-col items-center">
        <div className="flex items-center">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="bg-gray-300 text-gray-700 py-2 px-4 rounded disabled:opacity-50"
          >
            Previous
          </button>

          <span className="text-gray-700 mx-4">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="bg-gray-300 text-gray-700 py-2 px-4 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {isEditModalOpen && selectedLedger && (
        <EditLedgerModal
          ledger={selectedLedger}
          groups={groups}
          onClose={EditcloseModal}
          onSave={handleSave}
        />
      )}
            {isModalOpen && <LedgerCreationModal isOpen={isModalOpen} onClose={AddLedgercloseModal}  refreshLedgerOptions={refreshLedgerOptions}
      />}
    </div>
  );
};

export default LedgerInfo;
