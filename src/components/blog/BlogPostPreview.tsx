import { formatDateEnglish } from "~/utils/functions/dates/formatDateEnglish";
import { urlFor } from "../../../sanity/lib/urlFor";
import Image from "next/image";
import Link from "next/link";
import type { BlogPost } from "types";
import { useRouter } from "next/router";

export default function BlogPostPreview({ post }: { post: BlogPost }) {
  // Use search to .replace() highlight every word that matches the search word
  const router = useRouter();
  const { search } = router.query;

  const {
    mainImage,
    publishedAt,
    slug,
    categories,
    title,
    textPreview,
    author,
  } = post;

  const postImageUrl = mainImage
    ? urlFor(mainImage).width(768).height(520).url()
    : "";

  const authorImageUrl = author?.image
    ? urlFor(author.image).width(80).height(80).url()
    : "";

  return (
    <article
      key={`${slug?.current}-blog-card`}
      className="flex flex-col items-start justify-between"
    >
      <div className="relative aspect-[16/9] w-full lg:aspect-[3/2]">
        <Image
          fill
          src={
            postImageUrl
            // "https://images.unsplash.com/photo-1613722434757-e6990063b306?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=988&q=80"
          }
          alt={mainImage.alt}
          className=" w-full rounded-2xl bg-gray-100 object-cover "
        />
        <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-gray-900/10" />
      </div>
      <div className="max-w-xl flex-grow">
        <div className="mt-5 flex items-center gap-4 text-xs">
          <time dateTime={publishedAt} className="py-1.5 text-gray-500">
            {formatDateEnglish(publishedAt)}
          </time>
          <div className="flex flex-wrap gap-3">
            {categories?.slice(0, 3).map((category) => {
              return (
                <Link
                  key={`post-category-tag-${category?.slug?.current}`}
                  href={`/cape-coral-guides/[category]`}
                  as={`/cape-coral-guides/${category?.slug?.current}`}
                  className="relative z-10 rounded-full bg-gray-100 px-3 py-1.5 font-medium text-gray-600 hover:bg-gray-300"
                >
                  {category?.title}
                </Link>
              );
            })}
          </div>
        </div>
        <div className="group relative">
          <h3 className="mt-3 text-lg font-semibold leading-6 text-gray-900 group-hover:text-gray-600">
            <Link
              href={`/cape-coral-guide/[slug]`}
              as={`/cape-coral-guide/${slug?.current}`}
            >
              <span className="absolute inset-0" />
              <div>
                {search
                  ? highlightSearchWords(title ?? "", search as string)
                  : title}
              </div>
            </Link>
          </h3>
          <p className="mt-5 line-clamp-3 text-sm leading-6 text-gray-600">
            <div>
              {search
                ? highlightSearchWords(textPreview ?? "", search as string)
                : textPreview}
            </div>
          </p>
        </div>
        <div className="relative mt-8 flex items-center gap-x-4">
          {/* Sanity Image */}
          <Image
            src={authorImageUrl}
            alt={author?.image?.alt}
            height={40}
            width={40}
            className="rounded-full bg-white"
          />
          <div className="text-sm leading-6">
            <p className="font-semibold text-gray-900">
              {/* Link to bio pages for authors (/team/thomas-forbang) */}
              <Link href={"/" + author?.slug.current}>
                <span className="absolute inset-0" />
                {author?.name}
              </Link>
            </p>
            <p className="text-gray-600">{author?.role}</p>
          </div>
        </div>
      </div>
    </article>
  );
}

function highlightSearchWords(text: string, searchWords: string) {
  const words = searchWords.trim().split(/\s+/);
  const regex = new RegExp(`(${words.join("|")})`, "gi");
  let match;
  const searchWordIndexes = [];

  while ((match = regex.exec(text)) !== null) {
    const wordIndex = match.index;
    searchWordIndexes.push(wordIndex);
  }

  searchWordIndexes.sort((a, b) => a - b);

  const firstSearchWordIndex = searchWordIndexes[0];
  if (firstSearchWordIndex && firstSearchWordIndex > 90) {
    text = "&hellip;" + text.slice(Math.max(0, firstSearchWordIndex - 110));
  }

  const highlightedText = text.replace(
    regex,
    (_, word: string) => `<span class="bg-yellow-200">${word}</span>`
  );

  return <p dangerouslySetInnerHTML={{ __html: highlightedText }} />;
}
