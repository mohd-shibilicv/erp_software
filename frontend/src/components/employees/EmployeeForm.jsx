import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InputWithLabel } from "@/components/ui/InputWithLabel";
import { api } from "@/services/api";

export default function EmployeeForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    designation: "",
    workBranch: "",
    joiningDate: "",
    arriveDate: "",
    nation: "",
    // Add other fields as needed
  });

  useEffect(() => {
    if (id) {
      fetchEmployee();
    }
  }, [id]);

  const fetchEmployee = async () => {
    try {
      const response = await api.get(`/employees/${id}/`);
      setFormData(response.data);
    } catch (error) {
      console.error("Error fetching employee:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        await api.put(`/employees/${id}/`, formData);
      } else {
        await api.post("/employees/", formData);
      }
      navigate("/employees");
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <InputWithLabel
        label="Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        required
      />
      <InputWithLabel
        label="Email"
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        required
      />
      <InputWithLabel
        label="Designation"
        name="designation"
        value={formData.designation}
        onChange={handleChange}
      />
      <InputWithLabel
        label="Work Branch"
        name="workBranch"
        value={formData.workBranch}
        onChange={handleChange}
      />
      <InputWithLabel
        label="Joining Date"
        name="joiningDate"
        type="date"
        value={formData.joiningDate}
        onChange={handleChange}
      />
      <InputWithLabel
        label="Arrive Date"
        name="arriveDate"
        type="date"
        value={formData.arriveDate}
        onChange={handleChange}
      />
      <InputWithLabel
        label="Nation"
        name="nation"
        value={formData.nation}
        onChange={handleChange}
      />
      {/* Add other fields as needed */}
      <Button type="submit">{id ? "Update" : "Create"} Employee</Button>
    </form>
  );
}
