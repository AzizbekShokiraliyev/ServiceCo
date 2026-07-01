import { useState } from "react"
import { MapPin, User } from "lucide-react"
import { ListContainer } from "@/components/shared/ListContainer"
import { InfoListItem } from "@/components/shared/InfoListItem"
import { SearchBar } from "@/components/shared/SearchBar"
import { AppPagination } from "@/components/shared/AppPagination"
import { useJobs } from "@/hooks/useJobs"
import { JOB_STATUS_CONFIG, JOB_TYPE_CONFIG } from "@/lib/jobStyles"

const JOB_TABS = [
  { value: "active", label: "Faol ishlar" },
  { value: "completed", label: "Bajarilganlar" },
  { value: "rejected", label: "Rad etilganlar" }, // Yangi tab qo'shildi
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

  const query = searchQuery.trim().toLowerCase()

  const filteredJobs = jobs.filter((job) => {
    // TAB MANTIQI: active, completed, rejected ni bir-biridan qat'iy ajratamiz
    if (
      activeTab === "active" &&
      (job.status === "completed" || job.status === "rejected")
    )
      return false
    if (activeTab === "completed" && job.status !== "completed") return false
    if (activeTab === "rejected" && job.status !== "rejected") return false

    // QIDIRUV MANTIQI
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

  const totalPages = Math.ceil(filteredJobs.length / ITEMS_PER_PAGE) || 1
  const sanitizedCurrentPage =
    currentPage > totalPages ? totalPages : currentPage

  const currentJobs = filteredJobs.slice(
    (sanitizedCurrentPage - 1) * ITEMS_PER_PAGE,
    sanitizedCurrentPage * ITEMS_PER_PAGE
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
        footer={
          <AppPagination
            currentPage={sanitizedCurrentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        }
        className="h-[510px]"
      >
        {isLoading ? (
          <div className="space-y-3 p-1">
            {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
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
            const typeConfig = JOB_TYPE_CONFIG[job.job_type ?? "electrical"]
            const statusConfig = JOB_STATUS_CONFIG[job.status]
            return (
              <InfoListItem
                key={job.id}
                icon={typeConfig.icon}
                iconBg={typeConfig.bg}
                iconColor={typeConfig.text}
                title={job.client_name ?? "Noma'lum"}
                statusLabel={statusConfig?.label || job.status}
                statusClassName={statusConfig?.className || ""}
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
