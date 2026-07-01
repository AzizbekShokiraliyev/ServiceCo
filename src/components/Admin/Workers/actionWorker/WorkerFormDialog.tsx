import { useState, useEffect } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import {
  useTechnicianCreate,
  useTechnicianUpdate,
} from "@/hooks/useTechnicians"
import type { Skill, Technician } from "@/interface/Interface"
import {
  workerSchema,
  type WorkerFormValues,
} from "@/components/shared/validation/worker.schema"

const SKILL_OPTIONS: { value: Skill; label: string }[] = [
  { value: "Electrical", label: "Elektrik" },
  { value: "Plumbing", label: "Santexnik" },
  { value: "HVAC", label: "Konditsioner" },
]

interface WorkerFormDialogProps {
  mode: "add" | "edit"
  worker?: Technician
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export default function WorkerFormDialog({
  mode,
  worker,
  open: controlledOpen,
  onOpenChange: setControlledOpen,
}: WorkerFormDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const { mutate: createTechnician } = useTechnicianCreate()
  const { mutate: updateTechnician } = useTechnicianUpdate()

  const open = mode === "add" ? internalOpen : (controlledOpen ?? false)
  const setOpen = mode === "add" ? setInternalOpen : setControlledOpen!

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<WorkerFormValues>({
    resolver: zodResolver(workerSchema),
    defaultValues: {
      fullName: worker?.full_name ?? "",
      skill: worker?.skill ?? "Electrical",
      phone: worker?.phone ?? "",
      description: worker?.description ?? "",
    },
  })

  useEffect(() => {
    if (mode === "edit" && open && worker) {
      reset({
        fullName: worker.full_name,
        skill: worker.skill,
        phone: worker.phone ?? "",
        description: worker.description ?? "",
      })
    }
  }, [mode, open, worker, reset])

  const handleOpenChange = (next: boolean) => {
    setOpen(next)
    if (!next) reset()
  }

  const onSubmit = (data: WorkerFormValues) => {
    const payload = {
      full_name: data.fullName,
      skill: data.skill as Skill,
      phone: data.phone || undefined,
      description: data.description || undefined,
    }

    if (mode === "add") {
      createTechnician(payload)
    } else if (worker) {
      updateTechnician({ id: worker.id, ...payload })
    }
    handleOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {mode === "add" && (
        <DialogTrigger asChild>
          <Button>
            <UserPlus className="h-4 w-4" />
            Ishchi qo'shish
          </Button>
        </DialogTrigger>
      )}

      <DialogContent className="sm:max-w-[420px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "add" ? "Yangi ishchi qo'shish" : "Ishchini tahrirlash"}
          </DialogTitle>
          <DialogDescription>
            {mode === "add"
              ? "Ishchi ma'lumotlarini kiriting va saqlang."
              : "Ma'lumotlarni o'zgartiring va saqlang."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="worker-name">Ism familiya</Label>
            <Input
              id="worker-name"
              placeholder="Alisher Karimov"
              autoFocus
              {...register("fullName")}
            />
            {errors.fullName && (
              <p className="text-xs text-destructive">
                {errors.fullName.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="worker-phone">Telefon raqami</Label>
            <Input
              id="worker-phone"
              placeholder="+998 90 123 45 67"
              {...register("phone")}
            />
            {errors.phone && (
              <p className="text-xs text-destructive">{errors.phone.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="worker-skill">Ish yo'nalishi</Label>
            <Controller
              control={control}
              name="skill"
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger id="worker-skill">
                    <SelectValue placeholder="Yo'nalishni tanlang" />
                  </SelectTrigger>
                  <SelectContent>
                    {SKILL_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.skill && (
              <p className="text-xs text-destructive">{errors.skill.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="worker-description">Tavsif</Label>
            <Textarea
              id="worker-description"
              rows={3}
              placeholder="Masalan: Toshkent shahri bo'yicha buyurtmalar uchun mas'ul"
              {...register("description")}
            />
            {errors.description && (
              <p className="text-xs text-destructive">
                {errors.description.message}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
            >
              Bekor qilish
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {mode === "add" ? "Qo'shish" : "Saqlash"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
