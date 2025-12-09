"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { ArrowDownUp, Filter } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { STARTUP_CATEGORIES } from "@/lib/constants"

const SortFilter = () => {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())

    if (value === "newest") {
      params.delete("sort")
    } else {
      params.set("sort", value)
    }

    router.push(`/?${params.toString()}`, { scroll: false })
  }

  const handleCategoryChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())

    if (value === "all") {
      params.delete("category")
    } else {
      params.set("category", value)
    }

    router.push(`/?${params.toString()}`, { scroll: false })
  }

  const currentSort = searchParams.get("sort") || "newest"
  const currentCategory = searchParams.get("category") || "all"

  return (
    <div className="flex flex-wrap gap-3 items-center justify-between w-full">
      <div className="flex items-center gap-2">
        <ArrowDownUp className="size-5 text-primary" />
        <Select value={currentSort} onValueChange={handleSortChange}>
          <SelectTrigger className="w-[170px] bg-white">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
            <SelectItem value="views">Most Viewed</SelectItem>
            <SelectItem value="likes">Most Liked</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2">
        <Filter className="size-5 text-primary" />
        <Select value={currentCategory} onValueChange={handleCategoryChange}>
          <SelectTrigger className="w-[170px] bg-white">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {STARTUP_CATEGORIES.map(category => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

export default SortFilter
