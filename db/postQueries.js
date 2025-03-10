const { PrismaClient } = require("@prisma/client");
const { comment } = require("./queries");

const prisma = new PrismaClient();

async function create(title, authorId, contentString, publishedBoolean) {
  const content = contentString.length > 0 ? contentString : null;
  const published = publishedBoolean ? publishedBoolean : false;
  const post = await prisma.post.create({
    data: {
      title,
      content,
      authorId,
      published,
    },
  });

  let success;

  if (!post) {
    success = false;
  } else {
    success = true;
  }

  return success;
}

async function readSingle(id) {
  const post = await prisma.post.findFirst({
    where: {
      id,
    },
  });

  if (!post) {
    return null;
  }

  return post;
}

async function deleteSingle(id) {
  const post = await readSingle(id);

  if (post) {
    const postComments = await prisma.comment.findMany({
      where: { postId: id },
    });
    for (comment in postComments) {
      const commentId = comment.id;
      await prisma.comment.delete({
        where: { id: commentId },
      });
    }

    await prisma.post.delete({
      where: { id },
    });
    return true;
  }
  return false;
}

async function readRecent(qty) {
  qty = qty ? qty : 10;
  const posts = await prisma.post.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: qty,
  });

  return posts;
}

async function update(id, newTitle, newContent, newPublished) {
  const oldPost = await readSingle(id);
  const title = newTitle.length > 0 ? newTitle : oldPost.title;
  const content = newContent.length > 0 ? newContent : oldPost.content;
  const published =
    newPublished !== undefined ? newPublished : oldPost.published;

  const updatedPost = await prisma.post.update({
    where: { id },
    data: {
      title,
      content,
      published,
    },
  });
  return updatedPost;
}

module.exports = {
  create,
  deleteSingle,
  readRecent,
  readSingle,
  update,
};
