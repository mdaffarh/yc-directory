import { defineField, defineType } from "sanity"

export const playlist = defineType({
  name: "playlist",
  title: "Playlist",
  type: "document",
  fields: [
    defineField({
      name: "title",
      type: "string",
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: "slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: "select",
      type: "array",
      of: [{ type: "reference", to: [{ type: "startup" }] }],
      validation: Rule => Rule.required().min(1),
    }),
  ],
})
