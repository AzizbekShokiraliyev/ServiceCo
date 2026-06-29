import { useState } from "react"
import { PlusCircle } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  issueSchema,
  type IssueFormValues,
} from "../shared/validation/user.schema"
import { useJobCreate } from "@/hooks/useJobs"
import { useProfile } from "@/hooks/useProfile"
import { toast } from "sonner"

export default function UserModal() {
  const [open, setOpen] = useState(false)
  const { data: profile } = useProfile()
  const { mutate: createJob, isPending } = useJobCreate()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IssueFormValues>({
    resolver: zodResolver(issueSchema),
  })

  const handleOpenChange = (next: boolean) => {
    setOpen(next)
    if (!next) reset()
  }

  const onSubmit = (data: IssueFormValues) => {
    createJob(
      {
        title: data.problem,
        client_name: data.fullName,
        client_phone: data.phone ?? null,
        address: data.location,
        job_type: null,
        status: "pending",
        technician_id: null,
        scheduled_start: null,
        scheduled_end: null,
        created_by: profile?.id ?? null,
      },
      {
        onSuccess: () => {
          setOpen(false)
          reset()
        },
        onError: (error) => {
          console.error("Job yaratishda xato:", error)
          toast(`Xatolik: ${error.message}`)
        },
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-1.5 h-4 w-4" />
          Muammo yuborish
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[420px]">
        <DialogHeader>
          <DialogTitle>Yangi muammo yuborish</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label htmlFor="fullName">Ism familiya</Label>
            <Input
              id="fullName"
              placeholder="John Doe"
              {...register("fullName")}
            />
            {errors.fullName && (
              <p className="text-xs text-red-500">{errors.fullName.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="phone">Telefon raqami</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+998 90 123 45 67"
              {...register("phone")}
            />
            {errors.phone && (
              <p className="text-xs text-red-500">{errors.phone.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="example@gmail.com"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-xs text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="location">Manzil</Label>
            <Input
              id="location"
              placeholder="Toshkent, Chilonzor..."
              {...register("location")}
            />
            {errors.location && (
              <p className="text-xs text-red-500">{errors.location.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="problem">Muammo tavsifi</Label>
            <Input
              id="problem"
              placeholder="Muammoni batafsil yozing..."
              {...register("problem")}
            />
            {errors.problem && (
              <p className="text-xs text-red-500">{errors.problem.message}</p>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => handleOpenChange(false)}
            >
              Bekor qilish
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Yuborilmoqda..." : "Yuborish"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
