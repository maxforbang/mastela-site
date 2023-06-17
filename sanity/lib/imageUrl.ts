import imageUrlBuilder from "@sanity/image-url";
import sanityClient from "./sanityClient";

export function imageUrl (source) {
	return imageUrlBuilder(sanityClient).image(source)
}