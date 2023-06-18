import sanityClient from "./sanityClient";
import { useNextSanityImage } from "next-sanity-image";

export function sanityImage(image) {
	return useNextSanityImage(sanityClient, image);
}