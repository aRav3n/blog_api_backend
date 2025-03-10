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

async function deleteSingle(id) {
  await prisma.user.delete({
    where: { id },
  });
}

async function readSingleFromEmail(email) {
  const user = await prisma.user.findFirst({
    where: { email },
  });
  return user;
}

async function readSingleFromId(id) {
  const user = await prisma.user.findFirst({
    where: { id },
  });
  return user;
}

async function updateInfo(id, newEmail, newUsername, newName) {
  const currentUser = await readSingleFromId(userId);
  const email = newEmail.length > 0 ? newEmail : currentUser.email;
  const username = newUsername.length > 0 ? newUsername : currentUser.username;
  const name = newName.length > 0 ? newName : currentUser.name;
  await prisma.user.update({
    where: { id },
    data: { email, username, name },
  });
}

async function updatePassword(id, hash) {
  await prisma.user.update({
    where: { id },
    data: { hash },
  });
}

module.exports = {
  create,
  deleteSingle,
  readSingleFromEmail,
  readSingleFromId,
  updateInfo,
  updatePassword,
};
