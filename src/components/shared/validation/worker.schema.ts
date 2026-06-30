import { z } from "zod"

export const workerSchema = z.object({
  fullName: z.string().min(2, "Ism kamida 2 ta belgidan iborat bo'lishi kerak"),
  skill: z.enum(["Electrical", "Plumbing", "HVAC"], {
    error: "Yo'nalishni tanlang",
  }),
  phone: z
    .string()
    .min(7, "Telefon raqami noto'g'ri")
    .optional()
    .or(z.literal("")),
  description: z.string().optional().or(z.literal("")),
})

export type WorkerFormValues = z.infer<typeof workerSchema>