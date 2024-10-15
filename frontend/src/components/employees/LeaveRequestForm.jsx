import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InputWithLabel } from "@/components/ui/InputWithLabel";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function LeaveRequestForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    employee: "", // This should be the ID of the employee
    leave_type: "",
    start_date: "",
    end_date: "",
    reason: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/leave/", formData);
      navigate("/leave-and-vacation");
    } catch (error) {
      console.error("Error submitting leave request:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <InputWithLabel
        label="Employee ID"
        name="employee"
        value={formData.employee}
        onChange={handleChange}
        required
      />
      <div className="flex flex-col gap-1">
        <label htmlFor="leave_type" className="text-sm">
          Leave Type
        </label>
        <Select
          name="leave_type"
          onValueChange={(value) =>
            setFormData({ ...formData, leave_type: value })
          }
        >
          <SelectTrigger className="w-full bg-white">
            <SelectValue placeholder="Select leave type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="AL">Annual Leave</SelectItem>
            <SelectItem value="SL">Sick Leave</SelectItem>
            <SelectItem value="UL">Unpaid Leave</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <InputWithLabel
        label="Start Date"
        name="start_date"
        type="date"
        value={formData.start_date}
        onChange={handleChange}
        required
      />
      <InputWithLabel
        label="End Date"
        name="end_date"
        type="date"
        value={formData.end_date}
        onChange={handleChange}
        required
      />
      <InputWithLabel
        label="Reason"
        name="reason"
        value={formData.reason}
        onChange={handleChange}
        required
      />
      <Button type="submit">Submit Leave Request</Button>
    </form>
  );
}
