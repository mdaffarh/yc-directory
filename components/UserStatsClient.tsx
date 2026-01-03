"use client"

import { client } from "@/sanity/lib/client"
import { AUTHOR_STATS_QUERY } from "@/sanity/lib/queries"
import { Eye, FileText, TrendingUp } from "lucide-react"
import React, { useEffect, useState } from "react"
import ExportCard from "./ExportCard"

interface StatsData {
  totalStartups: number
  startups: { views: number | null }[]
  topStartup?: {
    _id: string
    title: string | null
    views: number | null
    slug: { current: string } | null
  } | null
}

const UserStatsClient = ({ id, userName }: { id: string; userName: string }) => {
  const [stats, setStats] = useState<StatsData | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      const data = await client.withConfig({ useCdn: false }).fetch(AUTHOR_STATS_QUERY, { id })
      setStats(data)
    }
    fetchStats()
  }, [id])

  if (!stats) return null

  const { totalStartups = 0, startups = [], topStartup } = stats
  const totalViews = calculateTotalViews(startups)

  return (
    <ExportCard filename={`${userName}-analytics`} title="Analytics Overview">
      <div className="w-full bg-white p-6 rounded-[22px] border-[5px] border-black shadow-200" style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}>
        <h2 className="mb-5" style={{ fontSize: "24px", fontWeight: "900", color: "#000" }}>
          Analytics Overview
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {/* Total Startups */}
          <div className="bg-white border-[3px] border-black py-4 px-4 rounded-[16px]">
            <div className="flex items-center gap-3">
              <div className="flex-center size-12 rounded-full bg-primary-100">
                <FileText className="size-6 text-primary" />
              </div>
              <div>
                <p className="text-black-300" style={{ fontSize: "14px", fontWeight: "500" }}>
                  Total Startups
                </p>
                <p style={{ fontSize: "30px", fontWeight: "700", color: "#000" }}>{totalStartups}</p>
              </div>
            </div>
          </div>

          {/* Total Views */}
          <div className="bg-white border-[3px] border-black py-4 px-4 rounded-[16px]">
            <div className="flex items-center gap-3">
              <div className="flex-center size-12 rounded-full bg-primary-100">
                <Eye className="size-6 text-primary" />
              </div>
              <div>
                <p className="text-black-300" style={{ fontSize: "14px", fontWeight: "500" }}>
                  Total Views
                </p>
                <p style={{ fontSize: "30px", fontWeight: "700", color: "#000" }}>{totalViews.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Top Startup */}
          <div className="bg-white border-[3px] border-black py-4 px-4 rounded-[16px]">
            <div className="flex items-center gap-3">
              <div className="flex-center size-12 rounded-full bg-primary-100">
                <TrendingUp className="size-6 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-black-300" style={{ fontSize: "14px", fontWeight: "500" }}>
                  Top Startup
                </p>
                {topStartup ? (
                  <div>
                    <p className="line-clamp-1" style={{ fontSize: "16px", fontWeight: "500", color: "#000" }}>
                      {topStartup.title}
                    </p>
                    <p className="text-black-300" style={{ fontSize: "14px", fontWeight: "400" }}>
                      {topStartup.views} views
                    </p>
                  </div>
                ) : (
                  <p className="text-black-300" style={{ fontSize: "16px", fontWeight: "500" }}>
                    No startups yet
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer with username */}
        <div className="mt-5 pt-4 border-t-2 border-black-200">
          <p className="text-center text-black-300" style={{ fontSize: "14px", fontWeight: "500" }}>
            @{userName} • YC Directory
          </p>
        </div>
      </div>
    </ExportCard>
  )
}

export default UserStatsClient
