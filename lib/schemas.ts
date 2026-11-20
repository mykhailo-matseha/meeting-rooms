import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  email: z.email("Please enter a valid email address").trim(),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
