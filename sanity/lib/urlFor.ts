import imageUrlBuilder from "@sanity/image-url";
import sanityClient from "./sanityClient";
import type { SanityImage } from "types";
export function urlFor (source: SanityImage) {
	return imageUrlBuilder(sanityClient).image(source) ?? ''
}