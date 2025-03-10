const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function create(title, authorId, contentString, publishedBoolean) {
  const content = contentString.length > 0 ? contentString : null;
  const published = publishedBoolean ? publishedBoolean : false;
  await prisma.post.create({
    data: {
      title,
      content,
      authorId,
      published,
    },
  });
}

async function deleteSingle(id) {
  await prisma.post.delete({
    where: { id },
  });
}

async function readRecent(qty) {
  qty = qty > 0 ? qty : 10;
  const posts = await prisma.post.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: qty,
  });

  return posts;
}

async function readSingle(id) {
  const post = await prisma.post.findFirst({
    where: {
      id,
    },
  });

  return post;
}

async function update(id, newTitle, newContent, newPublished) {
  const oldPost = await readSingle(id);
  const title = newTitle.length > 0 ? newTitle : oldPost.title;
  const content = newContent.length > 0 ? newContent : oldPost.content;
  const published =
    newPublished !== undefined ? newPublished : oldPost.published;

  await prisma.post.update({
    where: { id },
    data: {
      title,
      content,
      published,
    },
  });
}

module.exports = {
  create,
  deleteSingle,
  readRecent,
  readSingle,
  update,
};
