import { groq } from "next-sanity";
import sanityClient from "../../../sanity/lib/sanityClient";
import { BlogPost } from "types";

export async function fetchFeaturedPosts() {
  // How far in advance you want to show a holiday post on the frontpage (in seconds)
  const secondsInADay = 60 * 60 * 24;
  const featureLength = 14 * secondsInADay;

  const featuredPostsQueryCalendarEvents = groq`*[
    _type == 'post' &&
    (
      dateTime(publishedAt) <= dateTime(now()) &&
      calendarEvent.isCalendarEvent && 
      dateTime(calendarEvent.eventDate) > dateTime(now()) &&
      dateTime(calendarEvent.eventDate) <= dateTime(now()) + $featureLength
    ) 
  ] | order(priority desc, publishedAt desc)[0..2] {
    mainImage,
    publishedAt,
    slug,
    title,
    author-> {
      name, image
    },
    calendarEvent
  }  `;

  const featuredPosts: BlogPost[] = await sanityClient.fetch(
    featuredPostsQueryCalendarEvents,
    {
      featureLength: featureLength,
    }
  );

  // TODO: Replace morePosts below code once sanity.io land answers question on how to order posts based on boolean value.
  // Combine allPostsQuery and featuredPostsQueryCalendarEvents on this page into one: featuredPostsQuery

  const morePostsQuery = groq`*[_type == 'post' && !calendarEvent.isCalendarEvent && dateTime(publishedAt) <= dateTime(now())] | order(priority desc, publishedAt desc)[0..2] {
    title,
    author->{name, slug, image, role},
    "categories": categories[]->{title, slug},
    mainImage,
    "textPreview": body[style == 'normal'][0].children[0].text, 
    publishedAt,
    slug,
  }`;

  const morePosts: BlogPost[] = await sanityClient.fetch(morePostsQuery);

  return featuredPosts.concat(morePosts).slice(0, 3);
}
