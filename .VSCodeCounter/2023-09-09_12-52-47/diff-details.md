# Diff Details

Date : 2023-09-09 12:52:47

Directory /Users/max/Documents/Code/mastela-site

Total : 164 files,  464 codes, 34 comments, 101 blanks, all 599 lines

[Summary](results.md) / [Details](details.md) / [Diff Summary](diff.md) / Diff Details

## Files
| filename | language | code | comment | blank | total |
| :--- | :--- | ---: | ---: | ---: | ---: |
| [.eslintrc.cjs](/.eslintrc.cjs) | JavaScript | 31 | 2 | 3 | 36 |
| [.sanity/runtime/app.js](/.sanity/runtime/app.js) | JavaScript | 7 | 2 | 3 | 12 |
| [.sanity/runtime/index.html](/.sanity/runtime/index.html) | HTML | 169 | 4 | 30 | 203 |
| [README.md](/README.md) | Markdown | 17 | 0 | 12 | 29 |
| [next.config.mjs](/next.config.mjs) | JavaScript | 17 | 11 | 2 | 30 |
| [package.json](/package.json) | JSON | 72 | 0 | 1 | 73 |
| [postcss.config.cjs](/postcss.config.cjs) | JavaScript | 7 | 0 | 2 | 9 |
| [prettier.config.cjs](/prettier.config.cjs) | JavaScript | 4 | 1 | 2 | 7 |
| [prisma/schema.prisma](/prisma/schema.prisma) | Prisma | 45 | 2 | 8 | 55 |
| [reservations.csv](/reservations.csv) | CSV | 93 | 0 | 0 | 93 |
| [sanity.cli.ts](/sanity.cli.ts) | TypeScript | 4 | 4 | 3 | 11 |
| [sanity.config.ts](/sanity.config.ts) | TypeScript | 15 | 7 | 4 | 26 |
| [sanity/env.ts](/sanity/env.ts) | TypeScript | 17 | 0 | 6 | 23 |
| [sanity/lib/image.ts](/sanity/lib/image.ts) | TypeScript | 10 | 0 | 4 | 14 |
| [sanity/lib/sanityClient.ts](/sanity/lib/sanityClient.ts) | TypeScript | 8 | 0 | 3 | 11 |
| [sanity/lib/urlFor.ts](/sanity/lib/urlFor.ts) | TypeScript | 6 | 0 | 0 | 6 |
| [sanity/schema.ts](/sanity/schema.ts) | TypeScript | 9 | 0 | 3 | 12 |
| [sanity/schemas/author.ts](/sanity/schemas/author.ts) | TypeScript | 61 | 0 | 2 | 63 |
| [sanity/schemas/blockContent.ts](/sanity/schemas/blockContent.ts) | TypeScript | 52 | 21 | 3 | 76 |
| [sanity/schemas/category.ts](/sanity/schemas/category.ts) | TypeScript | 51 | 0 | 2 | 53 |
| [sanity/schemas/post.ts](/sanity/schemas/post.ts) | TypeScript | 109 | 0 | 3 | 112 |
| [sanity/schemas/property.ts](/sanity/schemas/property.ts) | TypeScript | 151 | 8 | 3 | 162 |
| [src/components/DateRangePicker.tsx](/src/components/DateRangePicker.tsx) | TypeScript JSX | 98 | 3 | 10 | 111 |
| [src/components/Layout.tsx](/src/components/Layout.tsx) | TypeScript JSX | 314 | 60 | 9 | 383 |
| [src/components/PageOverlay.tsx](/src/components/PageOverlay.tsx) | TypeScript JSX | 71 | 1 | 2 | 74 |
| [src/components/SlideOver.tsx](/src/components/SlideOver.tsx) | TypeScript JSX | 73 | 0 | 3 | 76 |
| [src/components/blog/BlogPostPreview.tsx](/src/components/blog/BlogPostPreview.tsx) | TypeScript JSX | 127 | 4 | 13 | 144 |
| [src/components/blog/BlogPostsContent.tsx](/src/components/blog/BlogPostsContent.tsx) | TypeScript JSX | 83 | 0 | 4 | 87 |
| [src/components/blog/BlogSearchBar.tsx](/src/components/blog/BlogSearchBar.tsx) | TypeScript JSX | 96 | 0 | 7 | 103 |
| [src/components/blog/SkeletonBlogPostPreview.tsx](/src/components/blog/SkeletonBlogPostPreview.tsx) | TypeScript JSX | 33 | 0 | 5 | 38 |
| [src/components/home/AboutUsSection.tsx](/src/components/home/AboutUsSection.tsx) | TypeScript JSX | 132 | 0 | 3 | 135 |
| [src/components/home/AmenitiesSections.tsx](/src/components/home/AmenitiesSections.tsx) | TypeScript JSX | 90 | 0 | 5 | 95 |
| [src/components/home/BlogSection.tsx](/src/components/home/BlogSection.tsx) | TypeScript JSX | 81 | 0 | 7 | 88 |
| [src/components/home/FAQSection.tsx](/src/components/home/FAQSection.tsx) | TypeScript JSX | 61 | 7 | 3 | 71 |
| [src/components/home/HeroSection.tsx](/src/components/home/HeroSection.tsx) | TypeScript JSX | 177 | 7 | 6 | 190 |
| [src/components/home/PropertiesSection.tsx](/src/components/home/PropertiesSection.tsx) | TypeScript JSX | 71 | 1 | 5 | 77 |
| [src/components/home/SupportSection.tsx](/src/components/home/SupportSection.tsx) | TypeScript JSX | 48 | 0 | 4 | 52 |
| [src/components/home/TestimonialsSection.tsx](/src/components/home/TestimonialsSection.tsx) | TypeScript JSX | 73 | 0 | 5 | 78 |
| [src/components/property/ImageGallery.tsx](/src/components/property/ImageGallery.tsx) | TypeScript JSX | 87 | 4 | 8 | 99 |
| [src/components/property/LoadingPropertyPage.tsx](/src/components/property/LoadingPropertyPage.tsx) | TypeScript JSX | 134 | 13 | 9 | 156 |
| [src/components/search/ListingCard.tsx](/src/components/search/ListingCard.tsx) | TypeScript JSX | 140 | 7 | 18 | 165 |
| [src/components/search/Map.tsx](/src/components/search/Map.tsx) | TypeScript JSX | 29 | 2 | 6 | 37 |
| [src/components/search/SkeletonInfoCard.tsx](/src/components/search/SkeletonInfoCard.tsx) | TypeScript JSX | 21 | 0 | 2 | 23 |
| [src/components/shared/ShareButton.tsx](/src/components/shared/ShareButton.tsx) | TypeScript JSX | 21 | 0 | 2 | 23 |
| [src/components/shared/Toast.tsx](/src/components/shared/Toast.tsx) | TypeScript JSX | 18 | 0 | 1 | 19 |
| [src/env.mjs](/src/env.mjs) | JavaScript | 31 | 17 | 5 | 53 |
| [src/pages/404.tsx](/src/pages/404.tsx) | TypeScript JSX | 29 | 0 | 5 | 34 |
| [src/pages/_app.tsx](/src/pages/_app.tsx) | TypeScript JSX | 25 | 0 | 5 | 30 |
| [src/pages/about.tsx](/src/pages/about.tsx) | TypeScript JSX | 371 | 3 | 13 | 387 |
| [src/pages/api/stripe/webhook.ts](/src/pages/api/stripe/webhook.ts) | TypeScript | 115 | 8 | 17 | 140 |
| [src/pages/api/trpc/[trpc].ts](/src/pages/api/trpc/%5Btrpc%5D.ts) | TypeScript | 16 | 1 | 2 | 19 |
| [src/pages/cape-coral-guide/[slug].tsx](/src/pages/cape-coral-guide/%5Bslug%5D.tsx) | TypeScript JSX | 158 | 2 | 24 | 184 |
| [src/pages/cape-coral-guide/index.tsx](/src/pages/cape-coral-guide/index.tsx) | TypeScript JSX | 115 | 3 | 12 | 130 |
| [src/pages/cape-coral-guides/[category].tsx](/src/pages/cape-coral-guides/%5Bcategory%5D.tsx) | TypeScript JSX | 79 | 5 | 18 | 102 |
| [src/pages/cape-coral-guides/index.tsx](/src/pages/cape-coral-guides/index.tsx) | TypeScript JSX | 56 | 3 | 14 | 73 |
| [src/pages/checkout.tsx](/src/pages/checkout.tsx) | TypeScript JSX | 632 | 31 | 58 | 721 |
| [src/pages/confirmation.tsx](/src/pages/confirmation.tsx) | TypeScript JSX | 217 | 2 | 22 | 241 |
| [src/pages/contact.tsx](/src/pages/contact.tsx) | TypeScript JSX | 195 | 0 | 4 | 199 |
| [src/pages/index.tsx](/src/pages/index.tsx) | TypeScript JSX | 87 | 6 | 15 | 108 |
| [src/pages/our-villas.tsx](/src/pages/our-villas.tsx) | TypeScript JSX | 30 | 3 | 6 | 39 |
| [src/pages/privacy.tsx](/src/pages/privacy.tsx) | TypeScript JSX | 59 | 0 | 4 | 63 |
| [src/pages/property/[property].tsx](/src/pages/property/%5Bproperty%5D.tsx) | TypeScript JSX | 721 | 23 | 64 | 808 |
| [src/pages/refund-policy.tsx](/src/pages/refund-policy.tsx) | TypeScript JSX | 52 | 0 | 4 | 56 |
| [src/pages/search.tsx](/src/pages/search.tsx) | TypeScript JSX | 105 | 3 | 14 | 122 |
| [src/pages/studio/[[...index]].tsx](/src/pages/studio/%5B%5B...index%5D%5D.tsx) | TypeScript JSX | 16 | 0 | 1 | 17 |
| [src/pages/terms.tsx](/src/pages/terms.tsx) | TypeScript JSX | 69 | 0 | 4 | 73 |
| [src/server/api/root.ts](/src/server/api/root.ts) | TypeScript | 8 | 6 | 3 | 17 |
| [src/server/api/routers/blog.ts](/src/server/api/routers/blog.ts) | TypeScript | 20 | 0 | 3 | 23 |
| [src/server/api/routers/properties.ts](/src/server/api/routers/properties.ts) | TypeScript | 354 | 137 | 42 | 533 |
| [src/server/api/stripe.ts](/src/server/api/stripe.ts) | TypeScript | 5 | 0 | 1 | 6 |
| [src/server/api/trpc.ts](/src/server/api/trpc.ts) | TypeScript | 31 | 56 | 10 | 97 |
| [src/server/db.ts](/src/server/db.ts) | TypeScript | 12 | 0 | 4 | 16 |
| [src/server/sanityClient.ts](/src/server/sanityClient.ts) | TypeScript | 11 | 0 | 3 | 14 |
| [src/styles/globals.css](/src/styles/globals.css) | CSS | 21 | 0 | 6 | 27 |
| [src/utils/api.ts](/src/utils/api.ts) | TypeScript | 30 | 32 | 6 | 68 |
| [src/utils/functions/dates/datesEqual.ts](/src/utils/functions/dates/datesEqual.ts) | TypeScript | 3 | 0 | 0 | 3 |
| [src/utils/functions/dates/formatDateEnglish.ts](/src/utils/functions/dates/formatDateEnglish.ts) | TypeScript | 21 | 0 | 6 | 27 |
| [src/utils/functions/dates/formatPhoneNumber.ts](/src/utils/functions/dates/formatPhoneNumber.ts) | TypeScript | 11 | 6 | 3 | 20 |
| [src/utils/functions/dates/utcDate.ts](/src/utils/functions/dates/utcDate.ts) | TypeScript | 4 | 0 | 2 | 6 |
| [src/utils/functions/formatCurrency.ts](/src/utils/functions/formatCurrency.ts) | TypeScript | 23 | 1 | 6 | 30 |
| [src/utils/functions/functions.tsx](/src/utils/functions/functions.tsx) | TypeScript JSX | 20 | 0 | 8 | 28 |
| [src/utils/functions/getBaseUrl.ts](/src/utils/functions/getBaseUrl.ts) | TypeScript | 4 | 0 | 0 | 4 |
| [src/utils/functions/getUrlParams.ts](/src/utils/functions/getUrlParams.ts) | TypeScript | 11 | 0 | 2 | 13 |
| [src/utils/sanityQueries.ts](/src/utils/sanityQueries.ts) | TypeScript | 29 | 6 | 5 | 40 |
| [tailwind.config.ts](/tailwind.config.ts) | TypeScript | 36 | 0 | 2 | 38 |
| [tsconfig.json](/tsconfig.json) | JSON with Comments | 25 | 9 | 0 | 34 |
| [types.ts](/types.ts) | TypeScript | 195 | 0 | 30 | 225 |
| [/Users/max/Documents/Legal/Mastela/Site/mastela-site/.eslintrc.cjs](//Users/max/Documents/Legal/Mastela/Site/mastela-site/.eslintrc.cjs) | JavaScript | -31 | -2 | -3 | -36 |
| [/Users/max/Documents/Legal/Mastela/Site/mastela-site/.sanity/runtime/app.js](//Users/max/Documents/Legal/Mastela/Site/mastela-site/.sanity/runtime/app.js) | JavaScript | -7 | -2 | -3 | -12 |
| [/Users/max/Documents/Legal/Mastela/Site/mastela-site/.sanity/runtime/index.html](//Users/max/Documents/Legal/Mastela/Site/mastela-site/.sanity/runtime/index.html) | HTML | -169 | -4 | -30 | -203 |
| [/Users/max/Documents/Legal/Mastela/Site/mastela-site/README.md](//Users/max/Documents/Legal/Mastela/Site/mastela-site/README.md) | Markdown | -17 | 0 | -12 | -29 |
| [/Users/max/Documents/Legal/Mastela/Site/mastela-site/next.config.mjs](//Users/max/Documents/Legal/Mastela/Site/mastela-site/next.config.mjs) | JavaScript | -16 | -11 | -2 | -29 |
| [/Users/max/Documents/Legal/Mastela/Site/mastela-site/package.json](//Users/max/Documents/Legal/Mastela/Site/mastela-site/package.json) | JSON | -67 | 0 | -1 | -68 |
| [/Users/max/Documents/Legal/Mastela/Site/mastela-site/postcss.config.cjs](//Users/max/Documents/Legal/Mastela/Site/mastela-site/postcss.config.cjs) | JavaScript | -7 | 0 | -2 | -9 |
| [/Users/max/Documents/Legal/Mastela/Site/mastela-site/prettier.config.cjs](//Users/max/Documents/Legal/Mastela/Site/mastela-site/prettier.config.cjs) | JavaScript | -4 | -1 | -2 | -7 |
| [/Users/max/Documents/Legal/Mastela/Site/mastela-site/prisma/schema.prisma](//Users/max/Documents/Legal/Mastela/Site/mastela-site/prisma/schema.prisma) | Prisma | -17 | -2 | -4 | -23 |
| [/Users/max/Documents/Legal/Mastela/Site/mastela-site/sanity.cli.ts](//Users/max/Documents/Legal/Mastela/Site/mastela-site/sanity.cli.ts) | TypeScript | -4 | -4 | -3 | -11 |
| [/Users/max/Documents/Legal/Mastela/Site/mastela-site/sanity.config.ts](//Users/max/Documents/Legal/Mastela/Site/mastela-site/sanity.config.ts) | TypeScript | -15 | -7 | -4 | -26 |
| [/Users/max/Documents/Legal/Mastela/Site/mastela-site/sanity/env.ts](//Users/max/Documents/Legal/Mastela/Site/mastela-site/sanity/env.ts) | TypeScript | -17 | 0 | -6 | -23 |
| [/Users/max/Documents/Legal/Mastela/Site/mastela-site/sanity/lib/image.ts](//Users/max/Documents/Legal/Mastela/Site/mastela-site/sanity/lib/image.ts) | TypeScript | -10 | 0 | -4 | -14 |
| [/Users/max/Documents/Legal/Mastela/Site/mastela-site/sanity/lib/sanityClient.ts](//Users/max/Documents/Legal/Mastela/Site/mastela-site/sanity/lib/sanityClient.ts) | TypeScript | -8 | 0 | -3 | -11 |
| [/Users/max/Documents/Legal/Mastela/Site/mastela-site/sanity/lib/urlFor.ts](//Users/max/Documents/Legal/Mastela/Site/mastela-site/sanity/lib/urlFor.ts) | TypeScript | -6 | 0 | 0 | -6 |
| [/Users/max/Documents/Legal/Mastela/Site/mastela-site/sanity/schema.ts](//Users/max/Documents/Legal/Mastela/Site/mastela-site/sanity/schema.ts) | TypeScript | -9 | 0 | -3 | -12 |
| [/Users/max/Documents/Legal/Mastela/Site/mastela-site/sanity/schemas/author.ts](//Users/max/Documents/Legal/Mastela/Site/mastela-site/sanity/schemas/author.ts) | TypeScript | -56 | 0 | -2 | -58 |
| [/Users/max/Documents/Legal/Mastela/Site/mastela-site/sanity/schemas/blockContent.ts](//Users/max/Documents/Legal/Mastela/Site/mastela-site/sanity/schemas/blockContent.ts) | TypeScript | -52 | -21 | -3 | -76 |
| [/Users/max/Documents/Legal/Mastela/Site/mastela-site/sanity/schemas/category.ts](//Users/max/Documents/Legal/Mastela/Site/mastela-site/sanity/schemas/category.ts) | TypeScript | -18 | 0 | -2 | -20 |
| [/Users/max/Documents/Legal/Mastela/Site/mastela-site/sanity/schemas/post.ts](//Users/max/Documents/Legal/Mastela/Site/mastela-site/sanity/schemas/post.ts) | TypeScript | -70 | 0 | -3 | -73 |
| [/Users/max/Documents/Legal/Mastela/Site/mastela-site/sanity/schemas/property.ts](//Users/max/Documents/Legal/Mastela/Site/mastela-site/sanity/schemas/property.ts) | TypeScript | -151 | -8 | -3 | -162 |
| [/Users/max/Documents/Legal/Mastela/Site/mastela-site/src/components/DateRangePicker.tsx](//Users/max/Documents/Legal/Mastela/Site/mastela-site/src/components/DateRangePicker.tsx) | TypeScript JSX | -90 | -3 | -9 | -102 |
| [/Users/max/Documents/Legal/Mastela/Site/mastela-site/src/components/Layout.tsx](//Users/max/Documents/Legal/Mastela/Site/mastela-site/src/components/Layout.tsx) | TypeScript JSX | -360 | -14 | -9 | -383 |
| [/Users/max/Documents/Legal/Mastela/Site/mastela-site/src/components/PageOverlay.tsx](//Users/max/Documents/Legal/Mastela/Site/mastela-site/src/components/PageOverlay.tsx) | TypeScript JSX | -71 | -1 | -2 | -74 |
| [/Users/max/Documents/Legal/Mastela/Site/mastela-site/src/components/SlideOver.tsx](//Users/max/Documents/Legal/Mastela/Site/mastela-site/src/components/SlideOver.tsx) | TypeScript JSX | -73 | 0 | -3 | -76 |
| [/Users/max/Documents/Legal/Mastela/Site/mastela-site/src/components/home/AboutUsSection.tsx](//Users/max/Documents/Legal/Mastela/Site/mastela-site/src/components/home/AboutUsSection.tsx) | TypeScript JSX | -132 | 0 | -3 | -135 |
| [/Users/max/Documents/Legal/Mastela/Site/mastela-site/src/components/home/AmenitiesSections.tsx](//Users/max/Documents/Legal/Mastela/Site/mastela-site/src/components/home/AmenitiesSections.tsx) | TypeScript JSX | -57 | 0 | -5 | -62 |
| [/Users/max/Documents/Legal/Mastela/Site/mastela-site/src/components/home/BlogSection.tsx](//Users/max/Documents/Legal/Mastela/Site/mastela-site/src/components/home/BlogSection.tsx) | TypeScript JSX | -115 | -1 | -7 | -123 |
| [/Users/max/Documents/Legal/Mastela/Site/mastela-site/src/components/home/FAQSection.tsx](//Users/max/Documents/Legal/Mastela/Site/mastela-site/src/components/home/FAQSection.tsx) | TypeScript JSX | -61 | -7 | -3 | -71 |
| [/Users/max/Documents/Legal/Mastela/Site/mastela-site/src/components/home/HeroSection.tsx](//Users/max/Documents/Legal/Mastela/Site/mastela-site/src/components/home/HeroSection.tsx) | TypeScript JSX | -175 | -2 | -6 | -183 |
| [/Users/max/Documents/Legal/Mastela/Site/mastela-site/src/components/home/PropertiesSection.tsx](//Users/max/Documents/Legal/Mastela/Site/mastela-site/src/components/home/PropertiesSection.tsx) | TypeScript JSX | -71 | -1 | -5 | -77 |
| [/Users/max/Documents/Legal/Mastela/Site/mastela-site/src/components/home/SupportSection.tsx](//Users/max/Documents/Legal/Mastela/Site/mastela-site/src/components/home/SupportSection.tsx) | TypeScript JSX | -48 | 0 | -4 | -52 |
| [/Users/max/Documents/Legal/Mastela/Site/mastela-site/src/components/home/TestimonialsSection.tsx](//Users/max/Documents/Legal/Mastela/Site/mastela-site/src/components/home/TestimonialsSection.tsx) | TypeScript JSX | -73 | 0 | -5 | -78 |
| [/Users/max/Documents/Legal/Mastela/Site/mastela-site/src/components/property/ImageGallery.tsx](//Users/max/Documents/Legal/Mastela/Site/mastela-site/src/components/property/ImageGallery.tsx) | TypeScript JSX | -101 | -3 | -9 | -113 |
| [/Users/max/Documents/Legal/Mastela/Site/mastela-site/src/components/property/LoadingPropertyPage.tsx](//Users/max/Documents/Legal/Mastela/Site/mastela-site/src/components/property/LoadingPropertyPage.tsx) | TypeScript JSX | -134 | -13 | -9 | -156 |
| [/Users/max/Documents/Legal/Mastela/Site/mastela-site/src/components/search/ListingCard.tsx](//Users/max/Documents/Legal/Mastela/Site/mastela-site/src/components/search/ListingCard.tsx) | TypeScript JSX | -140 | -7 | -17 | -164 |
| [/Users/max/Documents/Legal/Mastela/Site/mastela-site/src/components/search/Map.tsx](//Users/max/Documents/Legal/Mastela/Site/mastela-site/src/components/search/Map.tsx) | TypeScript JSX | -29 | -2 | -6 | -37 |
| [/Users/max/Documents/Legal/Mastela/Site/mastela-site/src/components/search/SkeletonInfoCard.tsx](//Users/max/Documents/Legal/Mastela/Site/mastela-site/src/components/search/SkeletonInfoCard.tsx) | TypeScript JSX | -21 | 0 | -2 | -23 |
| [/Users/max/Documents/Legal/Mastela/Site/mastela-site/src/components/shared/ShareButton.tsx](//Users/max/Documents/Legal/Mastela/Site/mastela-site/src/components/shared/ShareButton.tsx) | TypeScript JSX | -21 | 0 | -2 | -23 |
| [/Users/max/Documents/Legal/Mastela/Site/mastela-site/src/components/shared/Toast.tsx](//Users/max/Documents/Legal/Mastela/Site/mastela-site/src/components/shared/Toast.tsx) | TypeScript JSX | -18 | 0 | -1 | -19 |
| [/Users/max/Documents/Legal/Mastela/Site/mastela-site/src/env.mjs](//Users/max/Documents/Legal/Mastela/Site/mastela-site/src/env.mjs) | JavaScript | -31 | -17 | -5 | -53 |
| [/Users/max/Documents/Legal/Mastela/Site/mastela-site/src/pages/404.tsx](//Users/max/Documents/Legal/Mastela/Site/mastela-site/src/pages/404.tsx) | TypeScript JSX | -29 | 0 | -5 | -34 |
| [/Users/max/Documents/Legal/Mastela/Site/mastela-site/src/pages/_app.tsx](//Users/max/Documents/Legal/Mastela/Site/mastela-site/src/pages/_app.tsx) | TypeScript JSX | -19 | 0 | -5 | -24 |
| [/Users/max/Documents/Legal/Mastela/Site/mastela-site/src/pages/about.tsx](//Users/max/Documents/Legal/Mastela/Site/mastela-site/src/pages/about.tsx) | TypeScript JSX | -371 | -3 | -13 | -387 |
| [/Users/max/Documents/Legal/Mastela/Site/mastela-site/src/pages/api/stripe/webhook.ts](//Users/max/Documents/Legal/Mastela/Site/mastela-site/src/pages/api/stripe/webhook.ts) | TypeScript | -113 | -9 | -17 | -139 |
| [/Users/max/Documents/Legal/Mastela/Site/mastela-site/src/pages/api/trpc/[trpc].ts](//Users/max/Documents/Legal/Mastela/Site/mastela-site/src/pages/api/trpc/%5Btrpc%5D.ts) | TypeScript | -16 | -1 | -2 | -19 |
| [/Users/max/Documents/Legal/Mastela/Site/mastela-site/src/pages/cape-coral-guide/index.tsx](//Users/max/Documents/Legal/Mastela/Site/mastela-site/src/pages/cape-coral-guide/index.tsx) | TypeScript JSX | -367 | -17 | -12 | -396 |
| [/Users/max/Documents/Legal/Mastela/Site/mastela-site/src/pages/cape-coral-guide/slug.tsx](//Users/max/Documents/Legal/Mastela/Site/mastela-site/src/pages/cape-coral-guide/slug.tsx) | TypeScript JSX | -243 | -1 | -11 | -255 |
| [/Users/max/Documents/Legal/Mastela/Site/mastela-site/src/pages/checkout.tsx](//Users/max/Documents/Legal/Mastela/Site/mastela-site/src/pages/checkout.tsx) | TypeScript JSX | -633 | -55 | -60 | -748 |
| [/Users/max/Documents/Legal/Mastela/Site/mastela-site/src/pages/confirmation.tsx](//Users/max/Documents/Legal/Mastela/Site/mastela-site/src/pages/confirmation.tsx) | TypeScript JSX | -217 | -2 | -22 | -241 |
| [/Users/max/Documents/Legal/Mastela/Site/mastela-site/src/pages/contact.tsx](//Users/max/Documents/Legal/Mastela/Site/mastela-site/src/pages/contact.tsx) | TypeScript JSX | -195 | 0 | -4 | -199 |
| [/Users/max/Documents/Legal/Mastela/Site/mastela-site/src/pages/index.tsx](//Users/max/Documents/Legal/Mastela/Site/mastela-site/src/pages/index.tsx) | TypeScript JSX | -31 | -3 | -9 | -43 |
| [/Users/max/Documents/Legal/Mastela/Site/mastela-site/src/pages/our-villas.tsx](//Users/max/Documents/Legal/Mastela/Site/mastela-site/src/pages/our-villas.tsx) | TypeScript JSX | -30 | -3 | -6 | -39 |
| [/Users/max/Documents/Legal/Mastela/Site/mastela-site/src/pages/privacy.tsx](//Users/max/Documents/Legal/Mastela/Site/mastela-site/src/pages/privacy.tsx) | TypeScript JSX | -59 | 0 | -4 | -63 |
| [/Users/max/Documents/Legal/Mastela/Site/mastela-site/src/pages/property/[property].tsx](//Users/max/Documents/Legal/Mastela/Site/mastela-site/src/pages/property/%5Bproperty%5D.tsx) | TypeScript JSX | -722 | -25 | -63 | -810 |
| [/Users/max/Documents/Legal/Mastela/Site/mastela-site/src/pages/refund-policy.tsx](//Users/max/Documents/Legal/Mastela/Site/mastela-site/src/pages/refund-policy.tsx) | TypeScript JSX | -52 | 0 | -4 | -56 |
| [/Users/max/Documents/Legal/Mastela/Site/mastela-site/src/pages/search.tsx](//Users/max/Documents/Legal/Mastela/Site/mastela-site/src/pages/search.tsx) | TypeScript JSX | -105 | -3 | -14 | -122 |
| [/Users/max/Documents/Legal/Mastela/Site/mastela-site/src/pages/studio/[[...index]].tsx](//Users/max/Documents/Legal/Mastela/Site/mastela-site/src/pages/studio/%5B%5B...index%5D%5D.tsx) | TypeScript JSX | -16 | 0 | -1 | -17 |
| [/Users/max/Documents/Legal/Mastela/Site/mastela-site/src/pages/terms.tsx](//Users/max/Documents/Legal/Mastela/Site/mastela-site/src/pages/terms.tsx) | TypeScript JSX | -69 | 0 | -4 | -73 |
| [/Users/max/Documents/Legal/Mastela/Site/mastela-site/src/server/api/root.ts](//Users/max/Documents/Legal/Mastela/Site/mastela-site/src/server/api/root.ts) | TypeScript | -6 | -6 | -3 | -15 |
| [/Users/max/Documents/Legal/Mastela/Site/mastela-site/src/server/api/routers/properties.ts](//Users/max/Documents/Legal/Mastela/Site/mastela-site/src/server/api/routers/properties.ts) | TypeScript | -343 | -135 | -40 | -518 |
| [/Users/max/Documents/Legal/Mastela/Site/mastela-site/src/server/api/stripe.ts](//Users/max/Documents/Legal/Mastela/Site/mastela-site/src/server/api/stripe.ts) | TypeScript | -5 | 0 | -1 | -6 |
| [/Users/max/Documents/Legal/Mastela/Site/mastela-site/src/server/api/trpc.ts](//Users/max/Documents/Legal/Mastela/Site/mastela-site/src/server/api/trpc.ts) | TypeScript | -31 | -56 | -10 | -97 |
| [/Users/max/Documents/Legal/Mastela/Site/mastela-site/src/server/db.ts](//Users/max/Documents/Legal/Mastela/Site/mastela-site/src/server/db.ts) | TypeScript | -12 | 0 | -4 | -16 |
| [/Users/max/Documents/Legal/Mastela/Site/mastela-site/src/server/sanityClient.ts](//Users/max/Documents/Legal/Mastela/Site/mastela-site/src/server/sanityClient.ts) | TypeScript | -11 | 0 | -3 | -14 |
| [/Users/max/Documents/Legal/Mastela/Site/mastela-site/src/styles/globals.css](//Users/max/Documents/Legal/Mastela/Site/mastela-site/src/styles/globals.css) | CSS | -21 | 0 | -5 | -26 |
| [/Users/max/Documents/Legal/Mastela/Site/mastela-site/src/utils/api.ts](//Users/max/Documents/Legal/Mastela/Site/mastela-site/src/utils/api.ts) | TypeScript | -30 | -32 | -6 | -68 |
| [/Users/max/Documents/Legal/Mastela/Site/mastela-site/src/utils/functions/dates/datesEqual.ts](//Users/max/Documents/Legal/Mastela/Site/mastela-site/src/utils/functions/dates/datesEqual.ts) | TypeScript | -3 | 0 | 0 | -3 |
| [/Users/max/Documents/Legal/Mastela/Site/mastela-site/src/utils/functions/dates/formatDateEnglish.ts](//Users/max/Documents/Legal/Mastela/Site/mastela-site/src/utils/functions/dates/formatDateEnglish.ts) | TypeScript | -21 | 0 | -6 | -27 |
| [/Users/max/Documents/Legal/Mastela/Site/mastela-site/src/utils/functions/dates/formatPhoneNumber.ts](//Users/max/Documents/Legal/Mastela/Site/mastela-site/src/utils/functions/dates/formatPhoneNumber.ts) | TypeScript | -11 | -6 | -3 | -20 |
| [/Users/max/Documents/Legal/Mastela/Site/mastela-site/src/utils/functions/formatCurrency.ts](//Users/max/Documents/Legal/Mastela/Site/mastela-site/src/utils/functions/formatCurrency.ts) | TypeScript | -23 | -1 | -6 | -30 |
| [/Users/max/Documents/Legal/Mastela/Site/mastela-site/src/utils/functions/functions.tsx](//Users/max/Documents/Legal/Mastela/Site/mastela-site/src/utils/functions/functions.tsx) | TypeScript JSX | -20 | 0 | -8 | -28 |
| [/Users/max/Documents/Legal/Mastela/Site/mastela-site/src/utils/functions/getBaseUrl.ts](//Users/max/Documents/Legal/Mastela/Site/mastela-site/src/utils/functions/getBaseUrl.ts) | TypeScript | -4 | 0 | 0 | -4 |
| [/Users/max/Documents/Legal/Mastela/Site/mastela-site/src/utils/functions/getUrlParams.ts](//Users/max/Documents/Legal/Mastela/Site/mastela-site/src/utils/functions/getUrlParams.ts) | TypeScript | -11 | 0 | -2 | -13 |
| [/Users/max/Documents/Legal/Mastela/Site/mastela-site/tailwind.config.ts](//Users/max/Documents/Legal/Mastela/Site/mastela-site/tailwind.config.ts) | TypeScript | -34 | 0 | -2 | -36 |
| [/Users/max/Documents/Legal/Mastela/Site/mastela-site/tsconfig.json](//Users/max/Documents/Legal/Mastela/Site/mastela-site/tsconfig.json) | JSON with Comments | -25 | -9 | 0 | -34 |
| [/Users/max/Documents/Legal/Mastela/Site/mastela-site/types.ts](//Users/max/Documents/Legal/Mastela/Site/mastela-site/types.ts) | TypeScript | -151 | 0 | -26 | -177 |

[Summary](results.md) / [Details](details.md) / [Diff Summary](diff.md) / Diff Details