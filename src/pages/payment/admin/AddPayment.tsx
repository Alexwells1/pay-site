// src/pages/admin/AddPayment.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "@/lib/axios";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { departments, levels } from "@/constants/data";

export default function AddPayment() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "",
    matricNumber: "",
    email: "",
    amount: "",
    level: "",
    department: "",
    type: "", // "college" or "department"
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    // Validate fields
    if (Object.values(form).some((val) => !val)) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      setLoading(true);
        // Send payment data to the server
      await axios.post("/payment", form);
      toast.success("Payment added and receipt sent");
      navigate("/admin/dashboard");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to add payment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4 space-y-6">
      <h2 className="text-2xl font-bold">Add New Payment</h2>

      <Input
        placeholder="Full Name"
        name="fullName"
        value={form.fullName}
        onChange={handleChange}
      />
      <Input
        placeholder="Matric Number"
        name="matricNumber"
        value={form.matricNumber}
        onChange={handleChange}
      />
      <Input
        placeholder="Email"
        type="email"
        name="email"
        value={form.email}
        onChange={handleChange}
      />
      <Input
        placeholder="Amount"
        type="number"
        name="amount"
        value={form.amount}
        onChange={handleChange}
      />

      <Select onValueChange={(val) => setForm({ ...form, level: val })}>
        <SelectTrigger>
          <SelectValue placeholder="Select Level" />
        </SelectTrigger>
        <SelectContent>
          {levels.map((level) => (
            <SelectItem key={level.key} value={level.value}>
              {level.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select onValueChange={(val) => setForm({ ...form, department: val })}>
        <SelectTrigger>
          <SelectValue placeholder="Select Department" />
        </SelectTrigger>
        <SelectContent>
          {departments.map((dept) => (
            <SelectItem key={dept.key} value={dept.name}>
              {dept.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select onValueChange={(val) => setForm({ ...form, type: val })}>
        <SelectTrigger>
          <SelectValue placeholder="Select Payment Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="college">College Due</SelectItem>
          <SelectItem value="departmental">Departmental Due</SelectItem>
        </SelectContent>
      </Select>

      <Button onClick={handleSubmit} disabled={loading} className="w-full">
        {loading ? "Submitting..." : "Add Payment"}
      </Button>
    </div>
  );
}
