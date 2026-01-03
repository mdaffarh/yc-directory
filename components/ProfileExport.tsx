"use client"

import { client } from "@/sanity/lib/client"
import { AUTHOR_BY_ID_QUERY, AUTHOR_STATS_QUERY } from "@/sanity/lib/queries"
import { Eye, FileText, TrendingUp, Heart } from "lucide-react"
import React, { useEffect, useRef, useState } from "react"
import { toPng } from "html-to-image"
import { toast } from "@/hooks/use-toast"
import { Download } from "lucide-react"
import Image from "next/image"
import { urlFor } from "@/sanity/lib/image"
import { calculateTotalViews } from "@/lib/helpers"

interface StatsData {
  totalStartups: number
  startups: { views: number | null; likes: number | null }[]
  topStartup?: {
    _id: string
    title: string | null
    views: number | null
    slug: { current: string } | null
  } | null
  mostLikedStartup?: {
    _id: string
    title: string | null
    likes: number | null
    slug: { current: string } | null
  } | null
  totalLikes: number
}

interface UserData {
  name: string
  username: string
  image: string
  bio: string
}

const ProfileExport = ({ id }: { id: string }) => {
  const [stats, setStats] = useState<StatsData | null>(null)
  const [user, setUser] = useState<UserData | null>(null)
  const [isExporting, setIsExporting] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchData = async () => {
      const [statsData, userData] = await Promise.all([client.withConfig({ useCdn: false }).fetch(AUTHOR_STATS_QUERY, { id }), client.fetch(AUTHOR_BY_ID_QUERY, { id })])
      setStats(statsData)
      setUser(userData)
    }
    fetchData()
  }, [id])

  const handleExport = async () => {
    if (!cardRef.current) return
    setIsExporting(true)

    try {
      await new Promise(resolve => setTimeout(resolve, 300))

      const dataUrl = await toPng(cardRef.current, {
        quality: 1,
        pixelRatio: 2,
        skipFonts: true,
        style: {
          fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
        },
      })

      const link = document.createElement("a")
      link.download = `${user?.username}-profile.png`
      link.href = dataUrl
      link.click()

      toast({
        title: "Downloaded successfully!",
        description: "Profile card has been saved as an image.",
      })
    } catch (err) {
      console.error("Export failed:", err)
      toast({
        title: "Export failed",
        description: err instanceof Error ? err.message : "Something went wrong.",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
    }
  }

  if (!stats || !user) return null

  const { totalStartups = 0, startups = [], topStartup, mostLikedStartup, totalLikes = 0 } = stats
  const totalViews = calculateTotalViews(startups)

  return (
    <div className="relative w-full">
      {/* Download Button */}
      <div className="absolute top-3 right-3 z-10">
        <button onClick={handleExport} disabled={isExporting} className="flex-center size-10 rounded-full bg-black border-2 border-black text-white hover:bg-black-100 transition-all shadow-100 disabled:opacity-50" title="Download Profile">
          <Download className="size-5" />
        </button>
      </div>

      {/* Exportable Card - 4:3 Aspect Ratio */}
      <div ref={cardRef} className="w-full md:aspect-[4/3] bg-white border-[3px] md:border-[5px] border-black rounded-[20px] md:rounded-[30px] shadow-200 overflow-hidden" style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}>
        <div className="flex flex-col md:flex-row w-full min-h-full">
          {/* Left Side - Profile */}
          <div className="w-full md:w-2/5 bg-primary flex flex-col items-center justify-center p-6 md:p-6 relative">
            <div className="absolute top-3 left-3 md:top-4 md:left-4 bg-white border-[2px] md:border-[3px] border-black rounded-full px-3 md:px-4 py-1">
              <p style={{ fontSize: "12px", fontWeight: "700", color: "#000" }} className="md:text-sm">
                {user.username}
              </p>
            </div>

            <div className="flex flex-col items-center justify-center gap-3 md:gap-4 py-6 md:py-8">
              <div className="relative">
                <Image src={user.image} alt={user.name} width={100} height={100} className="rounded-full border-[3px] md:border-[4px] border-black w-[100px] h-[100px] md:w-[180px] md:h-[180px]" style={{ objectFit: "cover" }} />
              </div>
              <div className="text-center px-2">
                <p style={{ fontSize: "16px", fontWeight: "900", color: "#fff" }} className="md:text-2xl">
                  @{user.username}
                </p>
                <p style={{ fontSize: "11px", fontWeight: "400", color: "rgba(255,255,255,0.9)", marginTop: "4px" }} className="md:text-sm md:mt-1">
                  {user.bio}
                </p>
              </div>
            </div>
          </div>

          {/* Right Side - Analytics */}
          <div className="w-full md:w-3/5 p-6 md:p-6 flex flex-col justify-between">
            <div>
              <h2 style={{ fontSize: "18px", fontWeight: "900", color: "#000", marginBottom: "16px" }} className="md:text-3xl md:mb-5">
                Analytics Overview
              </h2>

              {/* Total Startups - Full Width */}
              <div className="mb-3">
                <div className="bg-white border-[2px] md:border-[3px] border-black rounded-[10px] md:rounded-[12px] p-3 md:p-3 flex items-center gap-3 md:gap-3">
                  <div className="flex-center size-10 md:size-10 rounded-full" style={{ backgroundColor: "#FFE8F0" }}>
                    <FileText className="size-5 md:size-5" style={{ color: "#EE2B69" }} />
                  </div>
                  <div>
                    <p style={{ fontSize: "12px", fontWeight: "500", color: "#7D8087" }} className="md:text-xs">
                      Total Startups
                    </p>
                    <p style={{ fontSize: "20px", fontWeight: "700", color: "#000" }} className="md:text-2xl">
                      {totalStartups}
                    </p>
                  </div>
                </div>
              </div>

              {/* Grid 2x2 for Mobile */}
              <div className="grid grid-cols-1 md:grid-cols-1 gap-3">
                {/* Total Views & Total Likes - Grid Row 1 */}
                <div className="grid grid-cols-2 gap-2 md:grid-cols-1 md:gap-3">
                  {/* Total Views */}
                  <div className="bg-white border-[2px] md:border-[3px] border-black rounded-[10px] md:rounded-[12px] p-2 md:p-3 flex flex-col md:flex-row items-center gap-2 md:gap-3">
                    <div className="flex-center size-8 md:size-10 rounded-full" style={{ backgroundColor: "#FFE8F0" }}>
                      <Eye className="size-4 md:size-5" style={{ color: "#EE2B69" }} />
                    </div>
                    <div className="text-center md:text-left">
                      <p style={{ fontSize: "10px", fontWeight: "500", color: "#7D8087" }} className="md:text-xs">
                        Total Views
                      </p>
                      <p style={{ fontSize: "16px", fontWeight: "700", color: "#000" }} className="md:text-2xl">
                        {totalViews.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Total Likes */}
                  <div className="bg-white border-[2px] md:border-[3px] border-black rounded-[10px] md:rounded-[12px] p-2 md:p-3 flex flex-col md:flex-row items-center gap-2 md:gap-3">
                    <div className="flex-center size-8 md:size-10 rounded-full" style={{ backgroundColor: "#FFE8F0" }}>
                      <Heart className="size-4 md:size-5" style={{ color: "#EE2B69" }} />
                    </div>
                    <div className="text-center md:text-left">
                      <p style={{ fontSize: "10px", fontWeight: "500", color: "#7D8087" }} className="md:text-xs">
                        Total Likes
                      </p>
                      <p style={{ fontSize: "16px", fontWeight: "700", color: "#000" }} className="md:text-2xl">
                        {totalLikes.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Most Viewed & Most Liked - Grid Row 2 */}
                <div className="grid grid-cols-2 gap-2 md:grid-cols-1 md:gap-3">
                  {/* Most Viewed */}
                  <div className="bg-white border-[2px] md:border-[3px] border-black rounded-[10px] md:rounded-[12px] p-2 md:p-3 flex flex-col md:flex-row items-center md:items-center gap-2 md:gap-3">
                    <div className="flex-center size-8 md:size-10 rounded-full" style={{ backgroundColor: "#FFE8F0" }}>
                      <TrendingUp className="size-4 md:size-5" style={{ color: "#EE2B69" }} />
                    </div>
                    <div className="flex-1 min-w-0 w-full">
                      <p style={{ fontSize: "10px", fontWeight: "500", color: "#7D8087" }} className="md:text-xs text-center md:text-left">
                        Most Viewed
                      </p>
                      {topStartup ? (
                        <div>
                          <p style={{ fontSize: "11px", fontWeight: "600", color: "#000" }} className="md:text-sm truncate text-center md:text-left">
                            {topStartup.title}
                          </p>
                          <p style={{ fontSize: "9px", fontWeight: "400", color: "#7D8087" }} className="md:text-xs text-center md:text-left">
                            {topStartup.views} views
                          </p>
                        </div>
                      ) : (
                        <p style={{ fontSize: "11px", fontWeight: "500", color: "#7D8087" }} className="md:text-sm text-center md:text-left">
                          No startups yet
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Most Liked */}
                  <div className="bg-white border-[2px] md:border-[3px] border-black rounded-[10px] md:rounded-[12px] p-2 md:p-3 flex flex-col md:flex-row items-center md:items-center gap-2 md:gap-3">
                    <div className="flex-center size-8 md:size-10 rounded-full" style={{ backgroundColor: "#FFE8F0" }}>
                      <Heart className="size-4 md:size-5" style={{ color: "#EE2B69" }} />
                    </div>
                    <div className="flex-1 min-w-0 w-full">
                      <p style={{ fontSize: "10px", fontWeight: "500", color: "#7D8087" }} className="md:text-xs text-center md:text-left">
                        Most Liked
                      </p>
                      {mostLikedStartup ? (
                        <div>
                          <p style={{ fontSize: "11px", fontWeight: "600", color: "#000" }} className="md:text-sm truncate text-center md:text-left">
                            {mostLikedStartup.title}
                          </p>
                          <p style={{ fontSize: "9px", fontWeight: "400", color: "#7D8087" }} className="md:text-xs text-center md:text-left">
                            {mostLikedStartup.likes} likes
                          </p>
                        </div>
                      ) : (
                        <p style={{ fontSize: "11px", fontWeight: "500", color: "#7D8087" }} className="md:text-sm text-center md:text-left">
                          No startups yet
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center pt-4 md:pt-3 border-t-2 mt-4" style={{ borderColor: "#E5E7EB" }}>
              <p style={{ fontSize: "11px", fontWeight: "600", color: "#7D8087" }} className="md:text-xs">
                YC Directory
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Loading Overlay */}
      {isExporting && (
        <div className="absolute inset-0 flex-center bg-white/80 rounded-[30px] z-20">
          <div className="flex flex-col items-center gap-2">
            <div className="size-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-14-medium text-black-300">Exporting...</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProfileExport
