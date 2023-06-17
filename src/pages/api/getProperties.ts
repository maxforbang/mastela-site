// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest } from 'next';
import { groq } from 'next-sanity';
import sanityClient from '../../../sanity/lib/sanityClient';

//import { Tweet } from '../../typings'

const propertyQuery = groq`
  *[_type == "property"] {
    name,
    slug,
    preview
  } // | order(_createdAt desc)
`

// type Data = {
//   tweets: Tweet[]
// }

export default async function handler(
  req: NextApiRequest,
  res//: NextApiResponse<Data>
) {
  //const tweets: Tweet[] = await sanityClient.fetch(propertyQuery)
  const properties = await sanityClient.fetch(propertyQuery);

  res.status(200).json({ properties })
}