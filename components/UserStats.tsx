import { client } from "@/sanity/lib/client"
import { AUTHOR_STATS_QUERY } from "@/sanity/lib/queries"
import { Eye, FileText, TrendingUp } from "lucide-react"
import Link from "next/link"
import React from "react"

const UserStats = async ({ id }: { id: string }) => {
  const stats = await client.withConfig({ useCdn: false }).fetch(AUTHOR_STATS_QUERY, { id })

  if (!stats) return null

  const { totalStartups = 0, startups = [], topStartup } = stats
  const totalViews = startups.reduce((acc: number, s: { views: number }) => acc + (s.views || 0), 0)

  return (
    <div className="w-full">
      <h2 className="text-24-black mb-5">Analytics Overview</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {/* Total Startups */}
        <div className="startup-card group">
          <div className="flex items-center gap-3">
            <div className="flex-center size-12 rounded-full bg-primary-100">
              <FileText className="size-6 text-primary" />
            </div>
            <div>
              <p className="text-14-medium text-black-300">Total Startups</p>
              <p className="text-30-bold">{totalStartups}</p>
            </div>
          </div>
        </div>

        {/* Total Views */}
        <div className="startup-card group">
          <div className="flex items-center gap-3">
            <div className="flex-center size-12 rounded-full bg-primary-100">
              <Eye className="size-6 text-primary" />
            </div>
            <div>
              <p className="text-14-medium text-black-300">Total Views</p>
              <p className="text-30-bold">{totalViews.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Top Startup */}
        <div className="startup-card group">
          <div className="flex items-center gap-3">
            <div className="flex-center size-12 rounded-full bg-primary-100">
              <TrendingUp className="size-6 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-14-medium text-black-300">Top Startup</p>
              {topStartup ? (
                <Link href={`/startup/${topStartup._id}`} className="group/link">
                  <p className="text-16-medium line-clamp-1 group-hover/link:text-primary transition-colors">{topStartup.title}</p>
                  <p className="text-14-normal text-black-300">{topStartup.views} views</p>
                </Link>
              ) : (
                <p className="text-16-medium text-black-300">No startups yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserStats
