import StartupCard from "@/components/StartupCard"
import SearchForm from "../../components/SearchForm"
import { STARTUPS_QUERY, MOST_LIKED_STARTUPS_QUERY, PLAYLIST_BY_SLUG_QUERY } from "@/sanity/lib/queries"
import { StartupTypeCard } from "@/components/StartupCard"
import { sanityFetch, SanityLive } from "@/sanity/lib/live"
import { auth } from "@/auth"
import SortFilter from "@/components/SortFilter"
import { client } from "@/sanity/lib/client"

export default async function Home({ searchParams }: { searchParams: Promise<{ query?: string; sort?: string; category?: string }> }) {
  const { query, sort, category } = await searchParams
  const params = {
    search: query || null,
    sort: sort || null,
    category: category || null,
  }

  const session = await auth()

  const { data: posts } = await sanityFetch({ query: STARTUPS_QUERY, params })

  // Fetch most liked and editor picks only if no search query
  const [mostLikedStartups, editorPicks] = !query ? await Promise.all([client.fetch(MOST_LIKED_STARTUPS_QUERY), client.fetch(PLAYLIST_BY_SLUG_QUERY, { slug: "editor-picks" })]) : [null, null]

  return (
    <>
      <section className="pink_container bg-pinkeu">
        <h1 className="heading">
          Pitch Your Startup, <br /> Connect with Entrepreneurs
        </h1>
        <p className="sub-heading !max-w-3xl">
          Submit Ideas, Vote for Startups, and Join the YC Community. <br />
        </p>
        <SearchForm query={query} />
      </section>

      <section className="section_container">
        <p className="text-30-semibold">{query ? `Search results for "${query}"` : "All Startups"}</p>

        <div className="mt-5">
          <SortFilter />
        </div>

        <ul className="mt-7 card_grid">{posts?.length > 0 ? posts.map((post: StartupTypeCard) => <StartupCard key={post?._id} post={post} />) : <p className="no-results">No startups found</p>}</ul>
      </section>

      {/* Most Liked Startups Section */}
      {!query && mostLikedStartups && mostLikedStartups.length > 0 && (
        <section className="section_container">
          <p className="text-30-semibold">Most Liked Startups</p>
          <ul className="mt-7 card_grid">
            {mostLikedStartups.map((post: StartupTypeCard) => (
              <StartupCard key={post?._id} post={post} />
            ))}
          </ul>
        </section>
      )}

      {/* Editor Picks Section */}
      {!query && editorPicks?.select && editorPicks.select.length > 0 && (
        <section className="section_container">
          <p className="text-30-semibold">Editor Picks</p>
          <ul className="mt-7 card_grid">
            {editorPicks.select.map((post: StartupTypeCard) => (
              <StartupCard key={post?._id} post={post} />
            ))}
          </ul>
        </section>
      )}

      <SanityLive />
    </>
  )
}
