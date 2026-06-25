import { z } from "zod"

export const workerSchema = z.object({
  fullName: z.string().min(3, "Ism familiya kamida 3 ta belgidan iborat bo'lishi kerak"),
  skill: z.enum(["Electrical", "Plumbing", "HVAC"], {
    error: "Ish yo'nalishini tanlang",
  }),
})

export type WorkerFormValues = z.infer<typeof workerSchema>