import { client } from "@/sanity/lib/client"
import { LIKES_BY_AUTHOR_QUERY } from "@/sanity/lib/queries"
import React from "react"
import StartupCard, { StartupTypeCard } from "./StartupCard"

const UserLikes = async ({ id }: { id: string }) => {
  const likes = await client.withConfig({ useCdn: false }).fetch(LIKES_BY_AUTHOR_QUERY, { id })

  return <>{likes?.length > 0 ? likes.map((like: any) => like.startup && <StartupCard key={like._id} post={like.startup as StartupTypeCard} />) : <p className="no-result">No liked startups yet</p>}</>
}

export default UserLikes
