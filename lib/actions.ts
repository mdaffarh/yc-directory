"use server"

import { auth } from "@/auth"
import { parseServerActionResponse } from "./utils"
import slugify from "slugify"
import { writeClient } from "@/sanity/lib/write-client"
import { revalidatePath } from "next/cache"

export const createPitch = async (state: any, form: FormData, pitch: string) => {
  const session = await auth()

  if (!session) return parseServerActionResponse({ error: "Not signed in", status: "ERROR" })

  const { title, description, category, link } = Object.fromEntries(Array.from(form).filter(([key]) => key != "pitch"))

  const slug = slugify(title as string, { lower: true, strict: true })

  try {
    const startup = {
      title,
      description,
      category,
      image: link,
      slug: {
        _type: slug,
        current: slug,
      },
      author: {
        _type: "reference",
        _ref: session?.id,
      },
      pitch,
    }

    const result = await writeClient.create({ _type: "startup", ...startup })

    revalidatePath("/")

    return parseServerActionResponse({
      ...result,
      error: "",
      status: "SUCCESS",
    })
  } catch (error) {
    console.log(error)

    return parseServerActionResponse({
      error: JSON.stringify(error),
      status: "ERROR",
    })
  }
}

export const updatePitch = async (state: any, form: FormData, pitch: string, id: string) => {
  const session = await auth()

  if (!session) return parseServerActionResponse({ error: "Not signed in", status: "ERROR" })

  const { title, description, category, link } = Object.fromEntries(Array.from(form).filter(([key]) => key != "pitch"))

  const slug = slugify(title as string, { lower: true, strict: true })

  try {
    // Verify ownership before updating
    const existingStartup = await writeClient.fetch(`*[_type == "startup" && _id == $id][0]{ author }`, { id })

    if (existingStartup?.author?._ref !== session?.id) {
      return parseServerActionResponse({ error: "Unauthorized", status: "ERROR" })
    }

    const startup = {
      title,
      description,
      category,
      image: link,
      slug: {
        _type: slug,
        current: slug,
      },
      pitch,
    }

    const result = await writeClient.patch(id).set(startup).commit()

    revalidatePath(`/startup/${id}`)
    revalidatePath("/")
    revalidatePath(`/user/${session?.id}`)

    return parseServerActionResponse({
      ...result,
      error: "",
      status: "SUCCESS",
    })
  } catch (error) {
    console.log(error)

    return parseServerActionResponse({
      error: JSON.stringify(error),
      status: "ERROR",
    })
  }
}

export const deletePitch = async (id: string) => {
  const session = await auth()

  if (!session) return parseServerActionResponse({ error: "Not signed in", status: "ERROR" })

  try {
    // Verify ownership before deleting
    const existingStartup = await writeClient.fetch(`*[_type == "startup" && _id == $id][0]{ author }`, { id })

    if (existingStartup?.author?._ref !== session?.id) {
      return parseServerActionResponse({ error: "Unauthorized", status: "ERROR" })
    }

    await writeClient.delete(id)

    revalidatePath("/")
    revalidatePath(`/user/${session?.id}`)

    return parseServerActionResponse({
      error: "",
      status: "SUCCESS",
    })
  } catch (error) {
    console.log(error)

    return parseServerActionResponse({
      error: JSON.stringify(error),
      status: "ERROR",
    })
  }
}

export const toggleLike = async (startupId: string) => {
  const session = await auth()

  if (!session) return parseServerActionResponse({ error: "Not signed in", status: "ERROR" })

  try {
    // Check if like already exists
    const existingLike = await writeClient.fetch(`*[_type == "like" && author._ref == $authorId && startup._ref == $startupId][0]{ _id }`, { authorId: session?.id, startupId })

    if (existingLike) {
      // Remove like
      await writeClient.delete(existingLike._id)
      revalidatePath("/")
      revalidatePath(`/startup/${startupId}`)
      revalidatePath(`/user/${session?.id}`)

      return parseServerActionResponse({
        message: "Like removed",
        isLiked: false,
        status: "SUCCESS",
      })
    } else {
      // Add like
      const like = {
        _type: "like",
        author: {
          _type: "reference",
          _ref: session?.id,
        },
        startup: {
          _type: "reference",
          _ref: startupId,
        },
      }

      await writeClient.create(like)
      revalidatePath("/")
      revalidatePath(`/startup/${startupId}`)
      revalidatePath(`/user/${session?.id}`)

      return parseServerActionResponse({
        message: "Like added",
        isLiked: true,
        status: "SUCCESS",
      })
    }
  } catch (error) {
    console.log(error)

    return parseServerActionResponse({
      error: JSON.stringify(error),
      status: "ERROR",
    })
  }
}
