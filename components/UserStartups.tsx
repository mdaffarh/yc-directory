import React from "react"
import { client } from "@/sanity/lib/client"
import StartupCard, { StartupTypeCard } from "./StartupCard"
import { STARTUPS_BY_AUTHOR_QUERY } from "@/sanity/lib/queries"
import { auth } from "@/auth"

const UserStartups = async ({ id }: { id: string }) => {
  const session = await auth()
  const startups = await client.withConfig({ useCdn: false }).fetch(STARTUPS_BY_AUTHOR_QUERY, { id })
  const isOwner = session?.id === id

  return <>{startups?.length > 0 ? startups.map((startup: StartupTypeCard) => <StartupCard key={startup._id} post={startup} isOwner={isOwner} />) : <p className="no-result">No posts yet</p>}</>
}

export default UserStartups
