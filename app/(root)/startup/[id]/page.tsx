import { formatDate } from "@/lib/utils"
import { client, fetchWithRetry } from "@/sanity/lib/client"
import { LIKE_QUERY, PLAYLIST_BY_SLUG_QUERY, STARTUP_BY_ID_QUERY } from "@/sanity/lib/queries"
import { notFound } from "next/navigation"
import React, { Suspense } from "react"
import Image from "next/image"
import Link from "next/link"
import markdownit from "markdown-it"
import { Skeleton } from "@/components/ui/skeleton"
import View from "@/components/View"
import StartupCard, { StartupTypeCard } from "@/components/StartupCard"
import { auth } from "@/auth"
import LikeButton from "@/components/LikeButton"
import StartupActions from "@/components/StartupActions"
import { urlFor } from "@/sanity/lib/image"

export const experimental_ppr = true

const md = markdownit()

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const id = (await params).id
  const session = await auth()

  const [post, editorPicksPlaylist, like] = await Promise.all([
    fetchWithRetry(
      () => client.withConfig({ useCdn: false }).fetch(STARTUP_BY_ID_QUERY, { id }),
      { fallback: null }
    ),
    fetchWithRetry(
      () => client.fetch(PLAYLIST_BY_SLUG_QUERY, { slug: "editor-picks" }),
      { fallback: null }
    ),
    session ? fetchWithRetry(
      () => client.withConfig({ useCdn: false }).fetch(LIKE_QUERY, { authorId: session.id, startupId: id }),
      { fallback: null }
    ) : null,
  ])
  const editorPosts = editorPicksPlaylist?.select || []

  if (!post) return notFound()

  const isLiked = !!like
  const isOwner = session?.id === post.author?._id

  const parsedContent = md.render(post?.pitch || "")

  // Get image URL from Sanity asset
  const imageUrl = post.image ? urlFor(post.image).width(1200).height(675).url() : "/placeholder.png"

  return (
    <>
      <section className="pink_container !min-h-[230px]">
        <p className="tag">{formatDate(post?._createdAt)}</p>
        <h1 className="heading"> {post.title}</h1>
        <p className="sub-heading !max-w-5xl">{post.description}</p>
      </section>
      <section className="section_container">
        <Image src={imageUrl} alt={post.title || "Startup thumbnail"} className="w-full max-w-3xl mx-auto aspect-video object-cover rounded-xl" width={1200} height={675} priority />
        <div className="space-y-5 mt-10 max-w-4xl mx-auto">
          <div className="flex-between gap-5">
            <Link href={`/user/${post.author?._id}`} className="flex gap-2 items-center mb-3">
              <Image src={post.author?.image ?? "/placeholder.png"} alt="avatar" width={64} height={64} className="rounded-full drop-shadow-lg" />
              <div className="">
                <p className="text-20-medium">{post.author?.name}</p>
                <p className="text-16-medium !text-black-300">{post.author?.username}</p>
              </div>
            </Link>
            <p className="category-tag">{post.category}</p>
          </div>

          <div className="flex-between gap-3">
            {session && <LikeButton startupId={id} isLiked={isLiked} />}
            {isOwner && <StartupActions id={id} authorId={post.author._id} />}
          </div>

          <h3 className="text-30-bold">Pitch Detail</h3>

          {parsedContent ? <article className="prose max-w-4xl font-work-sans break-all" dangerouslySetInnerHTML={{ __html: parsedContent }} /> : <p className="no-result">No details provided</p>}
        </div>

        <hr className="divider" />

        {editorPosts?.length > 0 && (
          <div className="max-w-4xl mx-auto">
            <p className="text-30-semibold">Editor Picks</p>
            <ul className="mt-7 card_grid-sm">
              {editorPosts.map((post: StartupTypeCard, i: number) => (
                <StartupCard key={i} post={post} />
              ))}
            </ul>
          </div>
        )}

        <Suspense fallback={<Skeleton className="view_skeleton" />}>
          <View id={id} />
        </Suspense>
      </section>
    </>
  )
}

export default Page
