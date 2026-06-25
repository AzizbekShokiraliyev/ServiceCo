import { useState } from "react"
import { UserPlus } from "lucide-react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import type { Skill } from "@/interface/Interface"

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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  workerSchema,
  type WorkerFormValues,
} from "../shared/validation/worker.schema"

interface AddWorkerModalProps {
  onAdd: (name: string, skill: Skill) => void
}

export default function UserModal({ onAdd }: AddWorkerModalProps) {
  const [open, setOpen] = useState(false)

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<WorkerFormValues>({
    resolver: zodResolver(workerSchema),
    defaultValues: {
      fullName: "",
      skill: "Electrical",
    },
  })

  const handleOpenChange = (next: boolean) => {
    setOpen(next)
    if (!next) {
      reset()
    }
  }

  // 3. Validatsiyadan o'tsa ishlaydigan funksiya
  const onSubmit = (data: WorkerFormValues) => {
    onAdd(data.fullName, data.skill as Skill)
    setOpen(false)
    reset()
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <UserPlus className="mr-1.5 h-4 w-4" />
          Ishchi qo'shish
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[420px]">
        <DialogHeader>
          <DialogTitle>Yangi ishchi qo'shish</DialogTitle>
        </DialogHeader>

        {/* Formani handleSubmit ga o'raymiz */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label htmlFor="worker-name">Ism familiya</Label>
            <Input
              id="worker-name"
              placeholder="Alisher Karimov"
              autoFocus
              {...register("fullName")} // Inputga ulash
            />
            {/* Xatolik xabari */}
            {errors.fullName && (
              <p className="text-xs text-red-500">{errors.fullName.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label>Ish yo'nalishi</Label>
            {/* Select komponentini Controller bilan ulash */}
            <Controller
              control={control}
              name="skill"
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Yo'nalishni tanlang" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Electrical">Elektrik</SelectItem>
                    <SelectItem value="Plumbing">Santexnik</SelectItem>
                    <SelectItem value="HVAC">Konditsioner</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {/* Xatolik xabari */}
            {errors.skill && (
              <p className="text-xs text-red-500">{errors.skill.message}</p>
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
            {/* Disabled ni olib tashladik, chunki react-hook-form o'zi xatolikni ko'rsatadi */}
            <Button type="submit">Qo'shish</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
