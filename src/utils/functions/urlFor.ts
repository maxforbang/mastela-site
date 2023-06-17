import imageUrlBuilder from "@sanity/image-url";
import sanityClient from "../../../sanity/lib/sanityClient";

export function urlFor (source) {
	return imageUrlBuilder(sanityClient).image(source)
}