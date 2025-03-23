const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const userQueries = require("./userQueries");
const postQueries = require("./postQueries");

async function create(content, authorId, postId) {
  try {
    // currently not requiring a login to view and comment
    /*
    const authorExists = (await userQueries.readSingleFromId(authorId))
      ? true
      : false;
      */

    const postExists = (await postQueries.readSingle(postId)) ? true : false;

    if (postExists) {
      const comment = await prisma.comment.create({
        data: {
          content,
          // currently not requiring an account to post a comment
          // authorId,
          postId,
        },
      });
      return comment;
    }
  } catch (error) {
    console.error(error);
    return null;
  }
  return null;
}

async function deleteSingle(id) {
  const commentToDelete = await prisma.comment.findFirst({
    where: { id },
  });
  if (!commentToDelete) {
    return null;
  }

  const comment = await prisma.comment.delete({
    where: { id },
  });
  return comment;
}

async function readRecent(qty, postId) {
  const findObject = {
    where: { postId },
    orderBy: {
      createdAd: "desc",
    },
  };
  if (qty) {
    findObject.take = qty;
  }
  const comments = await prisma.comment.findMany(findObject);

  const commentArray = comments ? comments : null;

  return commentArray;
}

async function readSingle(id) {
  const comment = await prisma.comment.findFirst({
    where: { id },
  });

  return comment;
}

async function update(id, content) {
  const comment = await readSingle(id);
  if (!comment) {
    return null;
  }

  const updatedComment = await prisma.comment.update({
    where: { id },
    data: { content },
  });

  return updatedComment;
}

module.exports = {
  create,
  deleteSingle,
  readRecent,
  readSingle,
  update,
};
