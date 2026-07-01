import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import type { AboutUsDialogProps } from "@/interface/Interface"

export default function AboutUsDialog({ children }: AboutUsDialogProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>

      <PolygonAlertContent />
    </AlertDialog>
  )
}

function PolygonAlertContent() {
  return (
    <AlertDialogContent className="max-w-md rounded-xl sm:max-w-lg">
      <AlertDialogHeader>
        <AlertDialogTitle>
          <div className="text-xl font-bold tracking-tight text-primary">
            Loyiha haqida — ServiceCo Missiyasi
          </div>
        </AlertDialogTitle>
      </AlertDialogHeader>

      <div className="max-h-[60vh] space-y-2 overflow-y-auto text-sm leading-relaxed">
        <p>
          Mijozlardan buyurtmalar keladi: har bir ishning manzili, turi (elektr,
          santexnika, HVAC) va taxminiy davomiylik vaqti bor. Texniklarning
          malakasi har xil, shuning uchun HVAC (isitish/sovutish) ustasini
          adashib santexnika ishiga yuborib yubormasligimni qat'iy nazorat
          qilamiz.
        </p>

        <p>
          Ba'zida ishlar cho'zilib ketadi, ba'zida esa usta kasal bo'lib qoladi.
          Hamma bilan alohida telefonda gaplashish. Bu haqiqiy tartibsizlik!
        </p>

        <blockquote className="border-l-4 border-primary pl-3 text-muted-foreground italic">
          "Biz sizning ishingiz haqida qayg'uramiz, asablarni asrang"
        </blockquote>

        <div className="space-y-1.5 pt-1">
          <span className="font-semibold text-primary">
            Kutilayotgan yechim:
          </span>
          <ul className="list-disc space-y-1 pl-5 text-xs text-muted-foreground">
            <li>
              Barcha usta va kunlik ishlarni bitta umumiy ekranda ko'rish.
            </li>
            <li>
              Ishlarni usta ustiga osongina sudrab tashlash (Drag & Drop).
            </li>
            <li>
              Texniklar o'z telefonlarida shaxsiy ish jadvallarini ko'ra olishi.
            </li>
          </ul>
        </div>
      </div>

      <AlertDialogFooter>
        <AlertDialogAction>Tushunarli</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  )
}
