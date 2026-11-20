import { z } from "zod";

export const registerSchema = z
  .object({
    name: z.string().trim().min(2, "Name must be at least 2 characters"),
    email: z.email("Please enter a valid email address").trim(),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: z.email("Please enter a valid email address").trim(),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const roomSchema = z.object({
  name: z.string().trim().min(3, "Room name must be at least 3 characters"),
  description: z.string().trim().optional().default(""),
});

export const addMemberSchema = z.object({
  email: z.email("Please enter a valid email address").trim(),
});

export const bookingSchema = z
  .object({
    title: z.string().trim().min(3, "Title must be at least 3 characters"),
    date: z.string().min(1, "Please select a date"),
    startTime: z.string().min(1, "Please select start time"),
    endTime: z.string().min(1, "Please select end time"),
  })
  .refine((data) => data.endTime > data.startTime, {
    message: "End time must be after start time",
    path: ["endTime"],
  });

export type BookingFormData = z.infer<typeof bookingSchema>;
