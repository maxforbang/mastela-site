import imageUrlBuilder from "@sanity/image-url";
import sanityClient from "./sanityClient";

export function urlFor (source) {
	return imageUrlBuilder(sanityClient).image(source)
}