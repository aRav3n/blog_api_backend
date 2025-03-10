const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function create(content, authorId, postId) {
  await prisma.comment.create({
    data: {
      content,
      authorId,
      postId,
    },
  });
}

async function deleteSingle(id) {
  await prisma.comment.delete({
    where: { id },
  });
}

async function readRecent(qty, postId) {
  const comments = await prisma.comment.findMany({
    where: { postId },
    orderBy: {
      createdAd: "desc",
    },
    take: qty,
  });

  return comments;
}

async function readSingle(id) {
  const comment = await prisma.comment.findFirst({
    where: { id },
  });

  return comment;
}

async function update(id, content) {
  await prisma.comment.update({
    where: { id },
    data: { content },
  });
}

module.exports = {
  create,
  deleteSingle,
  readRecent,
  readSingle,
  update,
};
