import { auth } from "@/auth"
import { client, fetchWithRetry } from "@/sanity/lib/client"
import { AUTHOR_BY_ID_QUERY } from "@/sanity/lib/queries"
import Image from "next/image"
import { notFound } from "next/navigation"
import React, { Suspense } from "react"
import UserStartups from "@/components/UserStartups"
import { StartupCardSkeleton } from "@/components/StartupCard"
import UserLikes from "@/components/UserLikes"
import ProfileExport from "@/components/ProfileExport"
import { Github, Mail } from "lucide-react"
import Link from "next/link"

export const dynamic = "force-dynamic"

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const id = (await params).id
  const session = await auth()

  const user = await fetchWithRetry(
    () => client.fetch(AUTHOR_BY_ID_QUERY, { id }),
    { fallback: null }
  )

  if (!user) return notFound()
  return (
    <>
      <section className="profile_container">
        <div className="profile_card">
          <div className="profile_title">
            <h3 className="text-24-black uppercase text-center line-clamp-1">{user.name}</h3>
          </div>
          <Image src={user.image || "/placeholder.png"} alt={user.name || "User"} width={220} height={220} className="profile_image" />

          <p className="text-30-extrabold mt-7 text-center">@{user?.username}</p>
          <p className="mt-1 text-center text-14-normal">{user?.bio}</p>

          {/* Contact Links */}
          <div className="flex gap-3 mt-5">
            <Link
              href={`https://github.com/${user.username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-center size-12 rounded-full bg-white border-[3px] border-black hover:bg-primary-100 transition-all shadow-100"
              title="GitHub Profile"
            >
              <Github className="size-6 text-black" />
            </Link>
            {user.email && (
              <Link href={`mailto:${user.email}`} className="flex-center size-12 rounded-full bg-white border-[3px] border-black hover:bg-primary-100 transition-all shadow-100" title="Send Email">
                <Mail className="size-6 text-black" />
              </Link>
            )}
          </div>
        </div>
        <div className="flex-1 flex flex-col gap-5 lg:-mt-5">
          {session?.id === id && (
            <Suspense fallback={<div className="skeleton h-32" />}>
              <ProfileExport id={id} />
            </Suspense>
          )}
          <p className="text-30-bold">{session?.id === id ? "Your" : "All"} Startups</p>
          <ul className="card_grid-sm">
            <Suspense fallback={<StartupCardSkeleton />}>
              <UserStartups id={id} />
            </Suspense>
          </ul>

          {session?.id === id && (
            <>
              <p className="text-30-bold mt-7" id="likes">
                Your Liked Startups
              </p>
              <ul className="card_grid-sm">
                <Suspense fallback={<StartupCardSkeleton />}>
                  <UserLikes id={id} />
                </Suspense>
              </ul>
            </>
          )}
        </div>
      </section>
    </>
  )
}

export default Page
