import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function recentComments(qty: number) {
  const comments = await prisma.comment.findMany({
    orderBy: {
      createdAd: "desc",
    },
    take: qty,
  });

  return comments;
}

async function recentPosts(qty: number) {
  const posts = await prisma.post.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: qty,
  });

  return posts;
}

module.exports = {
  recentComments,
  recentPosts,
};
