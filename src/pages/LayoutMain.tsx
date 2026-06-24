import { Button } from "@/components/ui/button"
import { Info } from "lucide-react"
import AboutUsDialog from "./AlertDialot" // Fayl nomini tekshiring

const LayoutMain = () => {
  return (
    <div className="relative flex min-h-[85vh] w-full flex-col items-center justify-center px-4 py-12 text-center sm:px-6 lg:px-8">
      <div className="absolute inset-0 -z-10" />

      <div className="max-w-3xl space-y-6">
        <h1 className="bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-5xl font-black tracking-tight text-transparent sm:text-7xl">
          ServiceCo
        </h1>

        <p className="mx-auto max-w-xl text-base leading-relaxed tracking-tight text-muted-foreground sm:text-lg">
          Schedule technicians, dispatch jobs, and track daily operations — all
          from one clean, real-time dashboard.
        </p>

        <div className="flex flex-col items-center justify-center gap-3 pt-4 sm:flex-row sm:gap-4">
          <AboutUsDialog>
            <Button
              variant="outline"
              size="lg"
              className="w-full gap-2 font-medium transition-transform active:scale-95 sm:w-auto"
            >
              <Info className="h-4 w-4 text-muted-foreground" /> Loyiha haqida
            </Button>
          </AboutUsDialog>
        </div>
      </div>
    </div>
  )
}

export default LayoutMain