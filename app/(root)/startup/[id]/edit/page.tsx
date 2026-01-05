import { auth } from "@/auth"
import StartupFormEdit from "@/components/StartupFormEdit"
import { client, fetchWithRetry } from "@/sanity/lib/client"
import { STARTUP_BY_ID_QUERY } from "@/sanity/lib/queries"
import { notFound, redirect } from "next/navigation"

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const id = (await params).id
  const session = await auth()

  if (!session) redirect("/")

  const post = await fetchWithRetry(
    () => client.fetch(STARTUP_BY_ID_QUERY, { id }),
    { fallback: null }
  )

  if (!post) return notFound()

  // Check if the current user is the author
  if (post.author?._id !== session?.id) {
    redirect(`/startup/${id}`)
  }

  return (
    <>
      <section className="pink_container !min-h-[230px]">
        <h1 className="heading">Edit Your Startup</h1>
      </section>

      <StartupFormEdit startup={post} />
    </>
  )
}

export default Page
