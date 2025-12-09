import { Heart } from "lucide-react"
import { defineField, defineType } from "sanity"

export const like = defineType({
  name: "like",
  title: "Like",
  type: "document",
  icon: Heart,
  fields: [
    defineField({
      name: "author",
      type: "reference",
      to: { type: "author" },
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: "startup",
      type: "reference",
      to: { type: "startup" },
      validation: Rule => Rule.required(),
    }),
  ],
  preview: {
    select: {
      authorName: "author.name",
      startupTitle: "startup.title",
    },
    prepare({ authorName, startupTitle }) {
      return {
        title: `${authorName} liked ${startupTitle}`,
      }
    },
  },
})
