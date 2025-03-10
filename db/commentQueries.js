const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const userQueries = require("./userQueries");
const postQueries = require("./postQueries");

async function create(content, authorId, postId) {
  try {
    const authorExists = (await userQueries.readSingleFromId(authorId))
      ? true
      : false;
    if (!authorExists) {
      return false;
    }

    const postExists = (await postQueries.readSingle(postId)) ? true : false;
    if (!postExists) {
      return false;
    }

    if (authorExists && postExists) {
      await prisma.comment.create({
        data: {
          content,
          authorId,
          postId,
        },
      });
      return true;
    }
  } catch (error) {
    console.error(error);
    return false;
  }
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
