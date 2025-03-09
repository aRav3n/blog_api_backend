const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function create(
  title,
  authorId,
  content,
  published
) {
  const contentString = content ? content : null;
  const publishedBool = published ? published : false;
  await prisma.post.create({
    data: {
      title: title,
      content: contentString,
      authorId: authorId,
      published: publishedBool,
    },
  });
}

async function readRecent(qty) {
  const posts = await prisma.post.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: qty,
  });

  return posts;
}

module.exports = {
  create,
  readRecent,
};
