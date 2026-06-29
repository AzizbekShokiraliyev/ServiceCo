import { Search, Plus } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { MastersRow } from "./MastersRow"

const workers = [
  {
    id: "1",
    full_name: "Aliyev Vali",
    skill: "Santexnik",
    phone: "+998 (90) 123-45-67",
    description: "Toshkent shahri bo'yicha buyurtmalar uchun mas'ul",
  },
  {
    id: "2",
    full_name: "Karimova Dilnoza",
    skill: "Elektrik",
    phone: "+998 (91) 234-56-78",
    description: "Chilonzor va Yunusobod tumanlari bo'yicha mas'ul",
  },
  {
    id: "3",
    full_name: "Yusupov Bekzod",
    skill: "Konditsioner ustasi",
    phone: "+998 (93) 345-67-89",
    description: "Sovutish tizimlarini o'rnatish va ta'mirlash",
  },
  {
    id: "4",
    full_name: "Nazarova Madina",
    skill: "Mebel ustasi",
    phone: "+998 (94) 456-78-90",
    description: "Buyurtma asosida mebel yig'ish va ta'mirlash",
  },
]

export default function MastersPage() {
  return (
    <div className="space-y-6">
      {/* ─── QIDIRUV VA QO'SHISH QISMI ─── */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="relative max-w-md flex-1">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Ism, kasb yoki telefon bo'yicha qidirish..."
            className="bg-background pl-9 shadow-sm"
          />
        </div>

        <Button className="gap-2 shadow-sm">
          <Plus className="h-4 w-4" />
          Yangi ishchi qo'shish
        </Button>
      </div>

      {/* ─── ISHCHILAR JADVALI ─── */}
      <div className="overflow-hidden rounded-xl border bg-background shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40">
              <TableHead className="w-[250px] font-semibold">
                Ishchi ismi
              </TableHead>
              <TableHead className="font-semibold">Yo'nalishi</TableHead>
              <TableHead className="font-semibold">Telefon raqami</TableHead>
              <TableHead className="max-w-[300px] font-semibold">
                Tavsif
              </TableHead>
              <TableHead className="text-right font-semibold">
                Amallar
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {workers.length > 0 ? (
              workers.map((worker) => (
                <MastersRow key={worker.id} worker={worker} />
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="h-24 text-center text-muted-foreground"
                >
                  Ishchilar topilmadi.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
