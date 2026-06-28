import { useState, useMemo } from "react"
import { MapPin, User, Wind, Droplet, Zap } from "lucide-react"
import { ListContainer } from "@/components/shared/ListContainer"
import { InfoListItem } from "@/components/shared/InfoListItem"
import { SearchBar } from "@/components/shared/SearchBar"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import type { JobType, JobStatus } from "@/interface/Interface"
import { useJobs } from "@/hooks/useJobs"

const TypeStyles: Record<
  JobType,
  { icon: React.ElementType; bg: string; text: string }
> = {
  hvac: { icon: Wind, bg: "bg-orange-500/10", text: "text-orange-500" },
  plumbing: { icon: Droplet, bg: "bg-cyan-500/10", text: "text-cyan-500" },
  electrical: { icon: Zap, bg: "bg-yellow-500/10", text: "text-yellow-500" },
}

const StatusStyles: Record<JobStatus, string> = {
  on_way: "text-muted-foreground border-border/60",
  in_progress: "text-blue-400 border-blue-500/30",
  completed: "text-emerald-400 border-emerald-500/30",
}

const StatusLabels: Record<JobStatus, string> = {
  on_way: "Yo'lda",
  in_progress: "Jarayonda",
  completed: "Bajarildi",
}

const JOB_TABS = [
  { value: "active", label: "Faol ishlar" },
  { value: "completed", label: "Bajarilganlar" },
]

const ITEMS_PER_PAGE = 4

export function RecentJobs() {
  const [activeTab, setActiveTab] = useState("active")
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)

  const { data: jobs = [], isLoading } = useJobs()

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    setCurrentPage(1)
  }

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    setCurrentPage(1)
  }

  const filteredJobs = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    return jobs.filter((job) => {
      if (activeTab === "active" && job.status === "completed") return false
      if (activeTab === "completed" && job.status !== "completed") return false

      if (query) {
        const matchesClient = job.client_name?.toLowerCase().includes(query)
        const matchesLocation = job.address?.toLowerCase().includes(query)
        const matchesTech = job.technician?.full_name
          ?.toLowerCase()
          .includes(query)
        return !!(matchesClient || matchesLocation || matchesTech)
      }

      return true
    })
  }, [jobs, activeTab, searchQuery])

  const totalPages = useMemo(() => {
    return Math.ceil(filteredJobs.length / ITEMS_PER_PAGE) || 1
  }, [filteredJobs.length])

  const sanitizedCurrentPage =
    currentPage > totalPages ? totalPages : currentPage

  // ✅ Hozirgi sahifadagi joblarni ajratib olish (slice)
  const currentJobs = useMemo(() => {
    return filteredJobs.slice(
      (sanitizedCurrentPage - 1) * ITEMS_PER_PAGE,
      sanitizedCurrentPage * ITEMS_PER_PAGE
    )
  }, [filteredJobs, sanitizedCurrentPage])

  // ✅ Pagignatsiya UI-ni keraksiz DOM-elementlarisiz va optimallashgan holda render qilish
  const paginationFooter = useMemo(
    () => (
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={
                sanitizedCurrentPage > 1
                  ? () => setCurrentPage((p) => p - 1)
                  : undefined
              }
              className={
                sanitizedCurrentPage === 1
                  ? "pointer-events-none opacity-40"
                  : "cursor-pointer"
              }
            />
          </PaginationItem>

          {Array.from({ length: totalPages }, (_, i) => {
            const page = i + 1
            return (
              <PaginationItem key={page}>
                <PaginationLink
                  isActive={sanitizedCurrentPage === page}
                  onClick={() => setCurrentPage(page)}
                  className="cursor-pointer"
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            )
          })}

          <PaginationItem>
            <PaginationNext
              onClick={
                sanitizedCurrentPage < totalPages
                  ? () => setCurrentPage((p) => p + 1)
                  : undefined
              }
              className={
                sanitizedCurrentPage === totalPages
                  ? "pointer-events-none opacity-40"
                  : "cursor-pointer"
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    ),
    [sanitizedCurrentPage, totalPages]
  )

  return (
    <div className="space-y-3">
      <SearchBar
        tabs={JOB_TABS}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        searchPlaceholder="Qidirish (ism, manzil, usta)..."
      />

      <ListContainer
        title="So'nggi ishlar"
        footer={paginationFooter}
        className="h-[510px]"
      >
        {isLoading ? (
          <div className="space-y-3 p-1">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="flex animate-pulse items-center gap-3 rounded-xl border border-border/40 bg-muted/20 p-3.5"
              >
                <div className="h-10 w-10 shrink-0 rounded-xl bg-muted/40" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-1/4 rounded-md bg-muted/40" />
                  <div className="h-3 w-1/2 rounded-md bg-muted/40" />
                </div>
                <div className="h-6 w-16 rounded-md bg-muted/40" />
              </div>
            ))}
          </div>
        ) : currentJobs.length === 0 ? (
          <div className="flex h-40 items-center justify-center rounded-xl border border-dashed text-sm text-muted-foreground">
            Buyurtmalar topilmadi.
          </div>
        ) : (
          currentJobs.map((job) => {
            const typeConfig = TypeStyles[job.job_type ?? "electrical"]
            return (
              <InfoListItem
                key={job.id}
                icon={typeConfig.icon}
                iconBg={typeConfig.bg}
                iconColor={typeConfig.text}
                title={job.client_name ?? "Noma'lum"}
                statusLabel={StatusLabels[job.status] || job.status}
                statusClassName={StatusStyles[job.status] || ""}
                subtitle={
                  <div className="flex items-center gap-3">
                    {job.address && (
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> {job.address}
                      </span>
                    )}
                    {job.technician && (
                      <>
                        <span>•</span>
                        <span className="flex items-center gap-1 font-medium text-foreground/80">
                          <User className="h-3 w-3" />{" "}
                          {job.technician.full_name}
                        </span>
                      </>
                    )}
                  </div>
                }
              />
            )
          })
        )}
      </ListContainer>
    </div>
  )
}
