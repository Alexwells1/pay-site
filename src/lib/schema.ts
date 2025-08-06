import { z } from "zod";

export const paymentSchema = z.object({
  fullName: z
    .string()
    .min(3, "Full name must be at least 3 characters")
    .max(100),
  matricNumber: z.string().min(5, "Matric number is required"),
  email: z.email("Invalid email address"),
  department: z.string().min(1, "Department is required"),
  level: z.string().min(1, "Level is required"),
  type: z.enum(["college", "department"]),
  amount: z.number().nonnegative("Amount must be 0 or more"),
});
