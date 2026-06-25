import { z } from "zod"

export const loginSchema = z.object({
  email: z.string().min(1, "Email kiritish majburiy").email("Noto'g'ri elektron pochta formati"),
  password: z.string().min(6, "Parol kamida 6 ta belgidan iborat bo'lishi kerak"),
})
export type LoginFormValues = z.infer<typeof loginSchema>

export const registerSchema = z.object({
  fullName: z.string().min(3, "Ism kamida 3 ta belgidan iborat bo'lishi kerak"),
  email: z.string().min(1, "Email kiritish majburiy").email("Noto'g'ri elektron pochta formati"),
  password: z.string().min(6, "Parol kamida 6 ta belgidan iborat bo'lishi kerak"),
})
export type RegisterFormValues = z.infer<typeof registerSchema>