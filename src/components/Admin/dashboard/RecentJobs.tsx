import { useState } from "react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Clock, MapPin, Zap, User } from "lucide-react"
import type { JobStatus, JobType } from "@/interface/Interface"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { JobStatusStyles, JobTypeStyles } from "@/components/shared/StyleStatus"

interface RecentJobItem {
  id: string
  client_name: string
  location: string
  job_type: JobType
  duration_estimate: string
  status: JobStatus
  technician: string
}

const ITEMS_PER_PAGE = 5

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
    status: "pending",
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
    status: "pending",
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
    client_name: "Tech Park Server Room",
    location: "Mustaqillik Sq",
    job_type: "hvac",
    duration_estimate: "5 hours",
    status: "completed",
    technician: "Diyor Hasanov",
  },
]

export function RecentJobs() {
  const [currentPage, setCurrentPage] = useState<number>(1)

  const totalPages = Math.ceil(mockRecentJobs.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const currentJobs = mockRecentJobs.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  )

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  return (
    <Card className="flex h-[540px] w-full flex-col justify-between sm:h-[545px]">
      <CardHeader className="pb-2">
        <CardTitle>
          <div className="text-base font-bold tracking-tight">
            Recent Job Assignments
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 space-y-2.5 overflow-hidden">
        {currentJobs.map((job) => {
          const typeConfig = JobTypeStyles[job.job_type]
          const TypeIcon = typeConfig?.icon || Zap

          return (
            <div
              key={job.id}
              className="flex flex-col justify-between gap-4 rounded-xl border border-border/40 bg-card/50 p-4 transition-all hover:bg-accent/30 sm:flex-row sm:items-center"
            >
              <div className="flex items-start gap-3.5">
                <div
                  className={cn("mt-0.5 rounded-lg border p-2", typeConfig?.bg)}
                >
                  <TypeIcon className="h-4 w-4" />
                </div>

                <div className="space-y-0.5">
                  <h4 className="text-sm font-semibold text-foreground">
                    {job.client_name}
                  </h4>
                  <div className="flex flex-wrap items-center gap-x-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> {job.location}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 font-medium text-foreground/80">
                      <User className="h-3 w-3" /> {job.technician}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between gap-3">
                <div className="flex h-[25px] w-[100px] items-center justify-center gap-1 rounded-md border bg-muted text-xs font-medium text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>{job.duration_estimate}</span>
                </div>

                <span
                  className={cn(
                    "min-w-[95px] rounded-lg border px-2.5 py-0.5 text-center text-xs font-semibold tracking-wide capitalize shadow-sm",
                    JobStatusStyles[job.status]
                  )}
                >
                  {job.status.replace("_", " ")}
                </span>
              </div>
            </div>
          )
        })}
      </CardContent>
      <div className="">
        <CardFooter>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  className={cn(
                    "cursor-pointer select-none",
                    currentPage === 1 && "pointer-events-none opacity-40"
                  )}
                  onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                    e.preventDefault()
                    handlePageChange(currentPage - 1)
                  }}
                />
              </PaginationItem>

              {Array.from({ length: totalPages }, (_, index) => {
                const pageNumber = index + 1
                return (
                  <PaginationItem key={pageNumber}>
                    <PaginationLink
                      className="cursor-pointer select-none"
                      isActive={currentPage === pageNumber}
                      onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                        e.preventDefault()
                        handlePageChange(pageNumber)
                      }}
                    >
                      {pageNumber}
                    </PaginationLink>
                  </PaginationItem>
                )
              })}

              <PaginationItem>
                <PaginationNext
                  className={cn(
                    "cursor-pointer select-none",
                    currentPage === totalPages &&
                      "pointer-events-none opacity-40"
                  )}
                  onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                    e.preventDefault()
                    handlePageChange(currentPage + 1)
                  }}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </CardFooter>
      </div>
    </Card>
  )
}
