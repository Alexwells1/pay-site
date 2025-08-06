// src/pages/StudentPaymentForm.tsx

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { departments, levels } from "@/constants/data";
import type { Program, Level } from "@/constants/types";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

interface StudentFormData {
  fullName: string;
  lastName: string;
  firstName: string;
  matricNumber: string;
  email: string;
  department: string;
  level: string;
    type: "college" | "departmental";
  amount: number;
}

interface student {
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  setFormData: (data: StudentFormData) => void;
  formData: StudentFormData;
  handlenameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}





export default function StudentPaymentForm({
  handleChange,
  handleSubmit,
  setFormData,
  formData,
  handlenameChange
}: student) {
  return (
    <main>
      <section className="max-w-xl mx-auto p-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>First Name</Label>
              <Input
                name="firstName"
                value={formData.firstName}
                placeholder="e.g. John"
                onChange={handlenameChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Last Name</Label>
              <Input
                name="lastName"
                value={formData.lastName}
                placeholder="e.g. Doe"
                onChange={handlenameChange}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Matric Number</Label>
            <Input
              value={formData.matricNumber}
              onChange={handleChange}
              name="matricNumber"
              placeholder="20######"
              pattern="20\d{6}"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Email</Label>
            <Input
              type="email"
              name="email"
              placeholder="p9E2H@example.com"
              value={formData.email}
              onChange={handleChange}
              required
             
            />
          </div>

          <div className="space-y-2">
            <Label>Department</Label>
            <Select
              value={formData.department}
              onValueChange={(value) =>
                setFormData({ ...formData, department: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select your department" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((dept: Program) => (
                  <SelectItem key={dept.key} value={dept.name}>
                    {dept.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Level</Label>
            <Select
              value={formData.level}
              onValueChange={(value) =>
                setFormData({ ...formData, level: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select your level" />
              </SelectTrigger>
              <SelectContent>
                {levels.map((level: Level) => (
                  <SelectItem key={level.key} value={level.value}>
                    {level.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            type="submit"
            disabled={
              !formData.fullName ||
              !formData.matricNumber ||
              !formData.email ||
              !formData.department ||
              !formData.level
            }
            className="w-full transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue to Summary
          </Button>
        </form>
      </section>
    </main>
  );
}
