import { z } from "zod"

export const issueSchema = z.object({
  fullName: z.string().min(3, "Ism kamida 3 ta belgidan iborat bo'lishi kerak"),
  email: z.string().email("Noto'g'ri elektron pochta formati"),
  phone: z.string().optional(),
  location: z.string().min(5, "Manzilni aniqroq kiriting"),
  problem: z.string().min(10, "Muammoni batafsilroq yozing (kamida 10 ta belgi)"),
})
export type IssueFormValues = z.infer<typeof issueSchema>