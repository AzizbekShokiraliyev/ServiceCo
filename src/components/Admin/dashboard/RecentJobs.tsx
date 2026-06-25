import { useState } from "react"
import { MapPin, User, Wind, Droplet, Zap } from "lucide-react"
import { ListContainer } from "@/components/shared/ListContainer"
import { InfoListItem } from "@/components/shared/InfoListItem"
import { SearchBar } from "@/components/shared/SearchBar" // <-- SearchBar ni chaqirdik
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import type { JobStatus, JobType } from "@/interface/Interface"

interface RecentJobItem {
  id: string
  client_name: string
  location: string
  job_type: JobType
  duration_estimate: string
  status: JobStatus
  technician: string
}

const mockRecentJobs: RecentJobItem[] = [
  {
    id: "1",
    client_name: "John Doe (Apartment 4B)",
    location: "123 Maple St",
    job_type: "hvac",
    duration_estimate: "2.5 hours",
    status: "in_progress",
    technician: "Ali Valiyev",
  },
  {
    id: "2",
    client_name: "Burger Joint Kitchen",
    location: "Gafur Gulam St, 12",
    job_type: "plumbing",
    duration_estimate: "4 hours",
    status: "on_way",
    technician: "Olim Toshov",
  },
  {
    id: "3",
    client_name: "Office Center 5th Floor",
    location: "Amir Temur Ave, 45",
    job_type: "electrical",
    duration_estimate: "1.5 hours",
    status: "completed",
    technician: "Diyor Hasanov",
  },
  {
    id: "4",
    client_name: "Grand Supermarket",
    location: "Nukus St, 88",
    job_type: "electrical",
    duration_estimate: "3 hours",
    status: "on_way",
    technician: "Ali Valiyev",
  },
  {
    id: "5",
    client_name: "Pizzeria Delivery Hub",
    location: "Navoiy Ave, 21",
    job_type: "plumbing",
    duration_estimate: "1 hour",
    status: "in_progress",
    technician: "Olim Toshov",
  },
  {
    id: "6",
    client_name: "Tashkent City Mall",
    location: "Navoiy Ave, 1",
    job_type: "hvac",
    duration_estimate: "5 hours",
    status: "completed",
    technician: "Diyor Hasanov",
  },
  {
    id: "7",
    client_name: "Grand Supermarket",
    location: "Nukus St, 88",
    job_type: "electrical",
    duration_estimate: "3 hours",
    status: "on_way",
    technician: "Ali Valiyev",
  },
]

const TypeStyles = {
  hvac: { icon: Wind, bg: "bg-orange-500/10", text: "text-orange-500" },
  plumbing: { icon: Droplet, bg: "bg-cyan-500/10", text: "text-cyan-500" },
  electrical: { icon: Zap, bg: "bg-yellow-500/10", text: "text-yellow-500" },
}

const StatusStyles = {
  on_way: "text-muted-foreground border-border/60",
  in_progress: "text-blue-400 border-blue-500/30",
  completed: "text-emerald-400 border-emerald-500/30",
}

const StatusLabels = {
  on_way: "Yo'lda",
  in_progress: "Jarayonda",
  completed: "Bajarildi",
}


const JOB_TABS = [
  { value: "active", label: "Faol ishlar" },
  { value: "completed", label: "Bajarilganlar" },
]

export function RecentJobs() {
  const [activeTab, setActiveTab] = useState("active")
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)

  const ITEMS_PER_PAGE = 4

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    setCurrentPage(1)
  }

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    setCurrentPage(1)
  }

  const filteredJobs = mockRecentJobs.filter((job) => {
    if (activeTab === "active" && job.status === "completed") return false
    if (activeTab === "completed" && job.status !== "completed") return false

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      const matchesClient = job.client_name.toLowerCase().includes(query)
      const matchesLocation = job.location.toLowerCase().includes(query)
      const matchesTech = job.technician.toLowerCase().includes(query)

      if (!matchesClient && !matchesLocation && !matchesTech) return false
    }
    return true
  })

  const totalPages = Math.ceil(filteredJobs.length / ITEMS_PER_PAGE) || 1
  const currentJobs = filteredJobs.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  const PaginationFooter = (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <div
            className={
              currentPage === 1
                ? "pointer-events-none opacity-40"
                : "cursor-pointer"
            }
          >
            <PaginationPrevious
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            />
          </div>
        </PaginationItem>

        {Array.from({ length: totalPages }, (_, i) => (
          <PaginationItem key={i + 1}>
            <div className="cursor-pointer">
              <PaginationLink
                isActive={currentPage === i + 1}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </PaginationLink>
            </div>
          </PaginationItem>
        ))}

        <PaginationItem>
          <div
            className={
              currentPage === totalPages
                ? "pointer-events-none opacity-40"
                : "cursor-pointer"
            }
          >
            <PaginationNext
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
            />
          </div>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )

  return (
    <div className="space-y-3">
      {/* SearchBar ishlatildi */}
      <SearchBar
        tabs={JOB_TABS}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        searchPlaceholder="Qidirish (ism, manzil, usta)..."
      />

      <ListContainer
        title="Recent Job Assignments"
        footer={PaginationFooter}
        className="h-[510px]"
      >
        {currentJobs.length === 0 ? (
          <div className="flex h-40 items-center justify-center rounded-xl border border-dashed text-sm text-muted-foreground">
            Buyurtmalar topilmadi.
          </div>
        ) : (
          currentJobs.map((job) => {
            const typeConfig = TypeStyles[job.job_type]
            return (
              <InfoListItem
                key={job.id}
                icon={typeConfig.icon}
                iconBg={typeConfig.bg}
                iconColor={typeConfig.text}
                title={job.client_name}
                duration={job.duration_estimate}
                statusLabel={StatusLabels[job.status] || job.status}
                statusClassName={StatusStyles[job.status]}

                subtitle={
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> {job.location}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 font-medium text-foreground/80">
                      <User className="h-3 w-3" /> {job.technician}
                    </span>
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
