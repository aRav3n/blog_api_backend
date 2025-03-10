const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function create(email, hash, username, name) {
  try {
    const user = await prisma.user.create({
      data: {
        username,
        email,
        name,
        hash,
      },
    });
    return user;
  } catch (error) {
    console.error(error);
  }
}

async function readSingleFromId(id) {
  console.log("readSingleFromId called");
  const user = await prisma.user.findFirst({
    where: { id },
  });
  return user;
}

async function deleteSingle(id) {
  try {
    const user = await readSingleFromId(id);
    if (!user) {
      return false;
    }

    const userComments = await prisma.comment.findMany({
      where: { authorId: id },
    });
    for (let i = 0; i < userComments.length; i++) {
      const comment = userComments[i];
      const commentId = comment.id;
      await prisma.comment.delete({
        where: { id: commentId },
      });
    }

    const userPosts = await prisma.post.findMany({
      where: { authorId: id },
    });
    for (let i = 0; i < userPosts.length; i++) {
      const post = userPosts[i];
      const postId = post.id;
      await prisma.post.delete({
        where: { id: postId },
      });
    }

    await prisma.post.delete({
      where: { authorId: id },
    });
    await prisma.user.delete({
      where: { id },
    });

    return true;
  } catch (error) {
    return error;
  }
}

async function readSingleFromEmail(email) {
  const user = await prisma.user.findFirst({
    where: { email },
  });
  return user;
}

async function updateInfo(id, newEmail, newUsername, newName) {
  const currentUser = await readSingleFromId(id);
  if (!currentUser) {
    return false;
  }
  const email = newEmail.length > 0 ? newEmail : currentUser.email;
  const username = newUsername.length > 0 ? newUsername : currentUser.username;

  let name;
  if (newName) {
    name = newName;
  } else if (currentUser.name) {
    name = currentUser.name;
  } else name = null;

  await prisma.user.update({
    where: { id },
    data: { email, username, name },
  });

  return true;
}

async function updatePassword(id, hash) {
  const user = await prisma.user.update({
    where: { id },
    data: { hash },
  });
  const length = Object.keys(user).length;
  if (length === 0) {
    return false;
  }
  return true;
}

module.exports = {
  create,
  deleteSingle,
  readSingleFromEmail,
  readSingleFromId,
  updateInfo,
  updatePassword,
};
