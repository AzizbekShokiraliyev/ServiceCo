import type React from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { SearchBarProps } from "@/interface/Interface"

export function SearchBar({
  tabs = [],
  activeTab,
  onTabChange,
  searchQuery,
  onSearchChange,
  searchPlaceholder = "Qidirish...",
}: SearchBarProps) {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e.target.value)
  }

  return (
    <div className="w-full">
      {tabs.length > 0 && activeTab && onTabChange ? (
        <Tabs value={activeTab} onValueChange={onTabChange}>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <TabsList>
              {tabs.map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="min-w-32"
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>

            <div className="relative w-full sm:w-80">
              <Search className="absolute top-2 left-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={searchPlaceholder}
                className="pl-9"
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>
          </div>
        </Tabs>
      ) : (
        <div className="flex justify-end">
          <div className="relative w-full sm:w-80">
            <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={searchPlaceholder}
              className="pl-9"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
        </div>
      )}
    </div>
  )
}
