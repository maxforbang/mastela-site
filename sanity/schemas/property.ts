import { defineArrayMember, defineField, defineType } from "sanity";

export default defineType({
  name: "property",
  title: "Property",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "name",
        maxLength: 96,
      },
      description:
        "How the name will appear in the URL bar (e.g. villa-encore)",
      hidden: true,
    }),
    defineField({
      title: "Occupancy",
      name: "occupancy",
      type: "object",
      fields: [
        { name: "guests", type: "number", title: "Guests" },
        { name: "bedrooms", type: "number", title: "Bedrooms" },
        { name: "beds", type: "number", title: "Beds" },
        { name: "bathrooms", type: "number", title: "Bathrooms" },
      ],
    }),
    defineField({
      name: "mainImage",
      title: "Main image",
      type: "image",
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alternative Text",
          description: "Image label for SEO purposes",
          hidden: true,
        },
      ],
    }),
    defineField({
      name: "preview",
      title: "Description Preview",
      description: "Headline text that appears before clicking *Show More*",
      type: "array",
      of: [
        defineArrayMember({
          title: "Block",
          type: "block",
          // Styles let you define what blocks can be marked up as. The default
          // set corresponds with HTML tags, but you can set any title or value
          // you want, and decide how you want to deal with it where you want to
          // use your content.
          styles: [
            { title: "Normal", value: "normal" },
            { title: "H1", value: "h1" },
            { title: "H2", value: "h2" },
            { title: "H3", value: "h3" },
            { title: "H4", value: "h4" },
            { title: "Quote", value: "blockquote" },
          ],
          // Marks let you mark up inline text in the Portable Text Editor
          marks: {
            // Decorators usually describe a single property – e.g. a typographic
            // preference or highlighting
            decorators: [
              { title: "Strong", value: "strong" },
              { title: "Emphasis", value: "em" },
            ],
            // Annotations can be any object structure – e.g. a link or a footnote.
            annotations: [
              {
                title: "URL",
                name: "link",
                type: "object",
                fields: [
                  {
                    title: "URL",
                    name: "href",
                    type: "url",
                  },
                ],
              },
            ],
          },
        }),
      ],
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "blockContent",
    }),
    defineField({
      name: "coords",
      title: "Coordinates",
      type: "object",
      hidden: true,
      fields: [
        {
          title: "Latitude",
          name: "lat",
          type: "number",
        },
        {
          title: "Longitude",
          name: "long",
          type: "number",
        },
      ],
    }),
  ],

  preview: {
    select: {
      title: "name",
      media: "mainImage",
    },
    prepare(selection) {
      return { ...selection };
    },
  },
});
