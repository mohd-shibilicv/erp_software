import React, { useEffect, useState } from "react";
import { api } from "@/services/api";
import { useToast } from "@/components/ui/use-toast";
import { PlusCircle } from "lucide-react";

const Managers = () => {
  const [managers, setManagers] = useState([]);
  const [filteredManagers, setFilteredManagers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  const [selectedManager, setSelectedManager] = useState(null);
  const [newManager, setNewManager] = useState({
    username: "",
    email: "",
    phone_number: "",
    password: "",
  });
  const [phoneError, setPhoneError] = useState("");

  useEffect(() => {
    fetchManagers();
  }, []);

  useEffect(() => {
    const filtered = managers.filter(
      (manager) =>
        manager.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        manager.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        manager.phone_number.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredManagers(filtered);
  }, [searchTerm, managers]);

  const fetchManagers = async () => {
    try {
      const response = await api.get("/branch-managers/");
      setManagers(response.data.results);
      setFilteredManagers(response.data.results);
    } catch (error) {
      console.error("Error fetching branch managers:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewManager({ ...newManager, [name]: value });
    if (name === "phone_number") {
      validatePhoneNumber(value);
    }
  };

  const validatePhoneNumber = (phone) => {
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    if (!phoneRegex.test(phone)) {
      setPhoneError("Please enter a valid phone number");
    } else {
      setPhoneError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (phoneError) {
      return;
    }
    try {
      const managerData = { ...newManager, role: "branch_manager" };
      if (isUpdating) {
        if (!managerData.password) {
          delete managerData.password;
        }
        await api.put(`/branch-managers/${selectedManager.id}/`, managerData);
        toast({
          title: "Manager Updated",
          description: `${managerData.username} has been successfully updated.`,
        });
      } else {
        await api.post("/branch-managers/", managerData);
        toast({
          title: "Manager Added",
          description: `${managerData.username} has been successfully added.`,
        });
      }
      setIsModalOpen(false);
      setNewManager({
        username: "",
        email: "",
        phone_number: "",
        password: "",
        is_active: true,
      });
      fetchManagers();
    } catch (error) {
      console.error(
        "Error creating/updating branch manager:",
        error.response?.data || error.message
      );
    }
  };

  const openUpdateModal = (manager) => {
    setIsUpdating(true);
    setSelectedManager(manager);
    setNewManager({
      username: manager.username,
      email: manager.email,
      phone_number: manager.phone_number,
      password: "",
      is_active: manager.is_active,
    });
    setIsModalOpen(true);
  };

  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Branch Manager Management
      </h1>

      <div className="flex items-center justify-between py-4">
        {/* Enhanced Search Component */}
        <div className="relative w-full max-w-sm">
          <input
            placeholder="Filter managers by name, email, or phone..."
            className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-violet-500 focus:border-violet-500 shadow-sm"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 16l-2-2m0 0a6 6 0 118.485-8.485A6 6 0 0116 14l-2 2zm-6-2h12"
              />
            </svg>
          </div>
        </div>

        {/* Add Branch Manager Button */}
        <button
          className="ml-4 px-4 py-2 flex gap-2 bg-violet-600 text-white rounded-lg shadow hover:bg-violet-700 focus:ring-2 focus:ring-violet-500 focus:ring-opacity-50"
          onClick={() => {
            setIsUpdating(false);
            setSelectedManager(null);
            setNewManager({
              username: "",
              email: "",
              phone_number: "",
              password: "",
              is_active: true,
            });
            setIsModalOpen(true);
          }}
        >
          <PlusCircle className="h-5 w-5" />
          <p>Add Branch Manager</p>
        </button>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto shadow rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Phone Number
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredManagers.map((manager) => (
              <tr key={manager.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {manager.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                  {manager.username}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                  {manager.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                  {manager.phone_number || "Not Available"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${manager.is_active
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                      }`}
                  >
                    {manager.is_active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button
                    onClick={() => openUpdateModal(manager)}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
              {isUpdating
                ? "Update Branch Manager"
                : "Create New Branch Manager"}
            </h3>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="username"
                value={newManager.username}
                onChange={handleInputChange}
                placeholder="Username"
                className="w-full p-2 mb-4 border border-gray-300 rounded"
                required
              />
              <input
                type="email"
                name="email"
                value={newManager.email}
                onChange={handleInputChange}
                placeholder="Email"
                className="w-full p-2 mb-4 border border-gray-300 rounded"
                required
              />
              <input
                type="tel"
                name="phone_number"
                value={newManager.phone_number}
                onChange={handleInputChange}
                placeholder="Phone Number"
                className="w-full p-2 mb-4 border border-gray-300 rounded"
              />
              {phoneError && (
                <p className="text-red-500 text-sm mb-2">{phoneError}</p>
              )}
              <input
                type="password"
                name="password"
                value={newManager.password}
                onChange={handleInputChange}
                placeholder={
                  isUpdating
                    ? "Leave blank to keep current password"
                    : "Password"
                }
                className="w-full p-2 mb-4 border border-gray-300 rounded"
                required={!isUpdating}
              />
              <div className="flex items-center mb-4">
                <label className="flex items-center cursor-pointer">
                  <div className="relative">
                    <input
                      type="checkbox"
                      className="sr-only"
                      name="is_active"
                      checked={newManager.is_active}
                      onChange={(e) =>
                        setNewManager({
                          ...newManager,
                          is_active: e.target.checked,
                        })
                      }
                    />
                    <div
                      className={`block w-14 h-8 rounded-full ${newManager.is_active ? "bg-violet-500" : "bg-gray-400"
                        }`}
                    ></div>
                    <div
                      className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition ${newManager.is_active ? "transform translate-x-6" : ""
                        }`}
                    ></div>
                  </div>
                  <div className="ml-3 text-gray-700 font-medium">
                    {newManager.is_active ? "Active" : "Inactive"}
                  </div>
                </label>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-violet-600 text-white rounded"
                  disabled={phoneError !== ""}
                >
                  {isUpdating ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Managers;
