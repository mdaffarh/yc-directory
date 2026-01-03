import StartupCard from "@/components/StartupCard"
import SearchForm from "../../components/SearchForm"
import { MOST_LIKED_STARTUPS_QUERY, PLAYLIST_BY_SLUG_QUERY } from "@/sanity/lib/queries"
import { StartupTypeCard } from "@/components/StartupCard"
import SortFilter from "@/components/SortFilter"
import { client } from "@/sanity/lib/client"

export default async function Home({ searchParams }: { searchParams: Promise<{ query?: string; sort?: string; category?: string }> }) {
  const { query, sort, category } = await searchParams

  // Build order clause based on sort parameter
  const sortValue = sort || "newest"
  let orderClause = "_createdAt desc"

  if (sortValue === "oldest") {
    orderClause = "_createdAt asc"
  } else if (sortValue === "views") {
    orderClause = "views desc"
  } else if (sortValue === "likes") {
    orderClause = 'count(*[_type == "like" && startup._ref == ^._id]) desc'
  }

  const params = {
    search: query || null,
    category: category || null,
  }

  // Build dynamic query with order clause
  const dynamicQuery = `
    *[_type == "startup" && defined(slug.current) && 
      (!defined($search) || title match $search || category match $search || author->name match $search) && 
      (!defined($category) || category == $category)
    ] | order(${orderClause}){
      _id,
      title,
      slug,
      _createdAt,
      author -> {
          _id, name, image, bio
      },
      views,
      description,
      category,
      image,
      "likes": count(*[_type == "like" && startup._ref == ^._id])
    }`

  const posts = await client.withConfig({ useCdn: false }).fetch(dynamicQuery, params)

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
    </>
  )
}
