import { groq } from "next-sanity";

export const allPostsQuery = groq`*[_type == 'post' && dateTime(publishedAt) <= dateTime(now())] | order(publishedAt desc) {
  title,
  author->{name, slug, image, role},
  "categories": categories[]->{title, slug},
  mainImage,
  "textPreview": body[style == 'normal'][0].children[0].text, 
  publishedAt,
  slug,
}`;

export const featuredCategoriesQuery = groq`*[_type == 'category' && (slug != null || priority != null)] | order(priority asc, slug.current asc) 
{
  title,
  slug,
}`;

export const allArticlesCategoryQuery = groq`*[_type == 'category' && title == 'All Articles'][0] {
  title,
  slug,
  description,
}`;

// Search Posts:
// Find any posts that match any text in the title or body
// Matches in the title can match just the beginning of the search word (e.g. "bo" will match "boat")
// Matches in the children must match the search word exactly
// Text preview is the paragraph that matches the searchstring
// If there is no text preview, (the search word matches the title but nothing in the article), the text preview is set to the first paragraph instead
export const searchPostsQuery = groq`*[_type == 'post' && dateTime(publishedAt) <= dateTime(now()) && (title match $searchString + "*" || body[].children[].text match $searchString)] {
  title,
  author->{name, slug, image, role},
  "categories": categories[]->{title, slug},
  mainImage,
  "textPreview": coalesce(body[style == 'normal' && children[].text match $searchString][0].children[0].text, body[style == 'normal'][0].children[0].text),
  publishedAt,
  slug,
} | order(priority desc, publishedAt desc) | score(title match $searchString + "*")`;
