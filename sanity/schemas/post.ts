import { defineField, defineType } from "sanity";

export default defineType({
  name: "post",
  title: "Post",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
    }),
    defineField({
      name: "author",
      title: "Author",
      type: "reference",
      to: { type: "author" },
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
        },
      ],
    }),
    defineField({
      name: "categories",
      title: "Categories",
      type: "array",
      of: [{ type: "reference", to: { type: "category" } }],
    }),
    defineField({
      name: "publishedAt",
      title: "Published at",
      type: "datetime",
    }),
    defineField({
      name: "calendarEvent",
      title: "Holiday / Calendar Event",
      type: "object",
      fields: [
        {
          name: "isCalendarEvent",
          type: "boolean",
          title: "Mark as Calendar Event",
          initialValue: false,
        },
        {
          name: "eventDate",
          type: "datetime",
          title: "Date of the Event",
          hidden: ({ parent }) => !parent?.isCalendarEvent,
          description: "If the date changes annually, set the next date",
        },
        {
          name: "dateChangesAnnually",
          type: "boolean",
          title: "Date Changes Annually",
          hidden: ({ parent }) => !parent?.isCalendarEvent,
          initialValue: false,
          description:
            "For events that change dates every year (for example, if that day always happens on a Saturday). Toggling this will automatically set a reminder to review this post ~2 weeks before this date next year. Allows you to put updated dates/information in the article + notify the newsletter of the article.",
        }, // TODO: Implement notification for annual posts that need to be reviewed
      ],
      description:
        "Mark this post as a calendar event post. It will be featured on the homepage for up to 2 weeks leading up to the date. Useful for holidays and for annual events like the Edison Festival of Light. Make sure the publishedAt date is close to the actual event (1-3 weeks before).",
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "blockContent",
    }),
  ],

  preview: {
    select: {
      title: "title",
      author: "author.name",
      media: "mainImage",
    },
    prepare(selection) {
      const { author } = selection;
      return { ...selection, subtitle: author && `by ${author}` };
    },
  },
});
