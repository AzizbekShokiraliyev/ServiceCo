"use client"

import { useState, useMemo } from "react"
import { Users, SearchX } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { MastersRow } from "./MastersRow"
import WorkerFormDialog from "./actionWorker/WorkerFormDialog"
import { AppPagination } from "@/components/shared/AppPagination"
import { useTechnicians } from "@/hooks/useTechnicians"
import { SearchBar } from "@/components/shared/SearchBar"

const ITEMS_PER_PAGE = 8

export default function MastersPage() {
  const { data: technicians = [], isLoading } = useTechnicians()
  const [query, setQuery] = useState("")
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    const q = query.toLowerCase()
    return technicians.filter(
      (w) =>
        w.full_name.toLowerCase().includes(q) ||
        w.phone?.toLowerCase().includes(q)
    )
  }, [technicians, query])

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE))
  const safePage = Math.min(page, totalPages)

  const paginated = filtered.slice(
    (safePage - 1) * ITEMS_PER_PAGE,
    safePage * ITEMS_PER_PAGE
  )

  // Jadval balandligi sakramasligi uchun bo'sh qatorlarni hisoblash
  const emptyRowsCount = Math.max(0, ITEMS_PER_PAGE - paginated.length)

  const handleSearchChange = (value: string) => {
    setQuery(value)
    setPage(1)
  }

  return (
    <div className="flex h-full flex-col space-y-6 pb-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
            <Users className="h-6 w-6 text-primary" />
            Ishchilar
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Barcha xodimlar ro'yxati va ularni boshqarish
          </p>
        </div>

        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
          <div className="w-full sm:w-[320px]">
            <SearchBar
              searchQuery={query}
              onSearchChange={handleSearchChange}
              searchPlaceholder="Ism yoki telefon qidirish..."
            />
          </div>
          <WorkerFormDialog mode="add" />
        </div>
      </div>

      <div className="flex flex-1 flex-col rounded-xl border bg-card shadow-sm">
        <div className="relative flex-1 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                <TableHead>Ishchi ismi</TableHead>
                <TableHead>Yo'nalishi</TableHead>
                <TableHead>Telefon</TableHead>
                <TableHead>Tavsif</TableHead>
                <TableHead className="text-right">Amallar</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-[400px] text-center">
                    <div className="flex animate-pulse flex-col items-center justify-center text-muted-foreground">
                      Yuklanmoqda...
                    </div>
                  </TableCell>
                </TableRow>
              ) : paginated.length > 0 ? (
                <>
                  {paginated.map((worker) => (
                    <MastersRow key={worker.id} worker={worker} />
                  ))}
                  {Array.from({ length: emptyRowsCount }).map((_, i) => (
                    <TableRow
                      key={`empty-${i}`}
                      className="h-[64px] border-transparent hover:bg-transparent"
                    >
                      <TableCell colSpan={5} />
                    </TableRow>
                  ))}
                </>
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-[400px] text-center">
                    <div className="flex flex-col items-center justify-center gap-3 text-muted-foreground">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted/50">
                        <SearchX className="h-6 w-6 text-muted-foreground/70" />
                      </div>
                      <p>Hech narsa topilmadi.</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex justify-end border-t bg-muted/20 p-4">
          <AppPagination
            currentPage={safePage}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      </div>
    </div>
  )
}
