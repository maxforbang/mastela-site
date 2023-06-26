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


