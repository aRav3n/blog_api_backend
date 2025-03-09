const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function create(content, authorId, postId) {
  await prisma.comment.create({
    data: {
      content: content,
      authorId: authorId,
      postId: postId,
    },
  });
}

async function readRecent(qty) {
  const comments = await prisma.comment.findMany({
    orderBy: {
      createdAd: "desc",
    },
    take: qty,
  });

  return comments;
}

module.exports = {
  create,
  readRecent,
};
