import { Review } from "types";
import { prisma } from "~/server/db";

export async function fetchReviews() {
  const reviews = prisma.review.findMany({ take: 20 });

  return reviews;
}
