import  { useState, useEffect } from "react";
import { api } from "@/services/api";
import { PlusCircle } from "lucide-react";

const Staff = () => {
  const [staff, setStaff] = useState([]);
  const [filteredStaff, setFilteredStaff] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    phone_number: "",
    password: "",
    is_active: true,
  });

  useEffect(() => {
    fetchStaff();
  }, [searchTerm]);

  useEffect(() => {
    const search = searchTerm.toLowerCase();
    const filtered = staff?.filter(
      (staff) =>
        staff.username.toLowerCase().includes(search) ||
        staff.email.toLowerCase().includes(search) ||
        staff.phone_number.toLowerCase().includes(search)
    );
    setFilteredStaff(filtered);
  }, [searchTerm, staff]);

  const fetchStaff = async () => {
    try {
      const response = await api.get("/staff/", {
        params: { search: searchTerm },
      });
      setStaff(response.data);
      setFilteredStaff(response.data);
    } catch (error) {
      console.error("Error fetching staff:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userData = { ...newUser, role: "staff" };
      if (isUpdating && !userData.password) {
        delete userData.password;
      }
      if (isUpdating) {
        await api.put(`/staff/${selectedStaff.id}/`, userData);
      } else {
        await api.post("/staff/", userData);
      }
      setIsModalOpen(false);
      setNewUser({
        username: "",
        email: "",
        phone_number: "",
        password: "",
        is_active: true,
      });
      fetchStaff();
    } catch (error) {
      console.error(
        "Error creating/updating staff:",
        error.response?.data || error.message
      );
    }
  };

  const openUpdateModal = (staff) => {
    setIsUpdating(true);
    setSelectedStaff(staff);
    setNewUser({
      username: staff.username,
      email: staff.email,
      phone_number: staff.phone_number,
      password: "",
      is_active: staff.is_active,
    });
    setIsModalOpen(true);
  };

  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Staff Management
      </h1>
      <div className="flex items-center justify-between py-4">
        <input
          placeholder="Filter staff by name, email, or phone..."
          className="max-w-sm p-2 border border-gray-300 rounded"
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          className="px-4 py-2 flex gap-2 bg-violet-600 text-white rounded hover:bg-violet-700"
          onClick={() => {
            setIsUpdating(false);
            setSelectedStaff(null);
            setNewUser({
              username: "",
              email: "",
              phone_number: "",
              password: "",
              is_active: true,
            });
            setIsModalOpen(true);
          }}
        >
          <PlusCircle />
          <p>Add Staff</p>
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
              {isUpdating ? "Update Staff" : "Create New Staff"}
            </h3>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="username"
                value={newUser.username}
                onChange={handleInputChange}
                placeholder="Username"
                className="w-full p-2 mb-4 border border-gray-300 rounded"
                required
              />
              <input
                type="email"
                name="email"
                value={newUser.email}
                onChange={handleInputChange}
                placeholder="Email"
                className="w-full p-2 mb-4 border border-gray-300 rounded"
                required
              />
              <input
                type="tel"
                name="phone_number"
                value={newUser.phone_number}
                onChange={handleInputChange}
                placeholder="Phone Number"
                className="w-full p-2 mb-4 border border-gray-300 rounded"
              />
              <input
                type="password"
                name="password"
                value={newUser.password}
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
                      checked={newUser.is_active}
                      onChange={(e) =>
                        setNewUser({ ...newUser, is_active: e.target.checked })
                      }
                    />
                    <div
                      className={`block w-14 h-8 rounded-full ${newUser.is_active ? "bg-violet-500" : "bg-gray-400"
                        }`}
                    ></div>
                    <div
                      className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition ${newUser.is_active ? "transform translate-x-6" : ""
                        }`}
                    ></div>
                  </div>
                  <div className="ml-3 text-gray-700 font-medium">
                    {newUser.is_active ? "Active" : "Inactive"}
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
                >
                  {isUpdating ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
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
            {filteredStaff?.map((staff) => (
              <tr key={staff.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {staff.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                  {staff.username || "Not Available"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                  {staff.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                  {staff.phone_number || "Not available"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${staff.is_active
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                      }`}
                  >
                    {staff.is_active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button
                    onClick={() => openUpdateModal(staff)}
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
    </div>
  );
};

export default Staff;
