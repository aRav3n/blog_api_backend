const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function create(email, hash, username, name) {
  const nameString = name.length > 0 ? name : null;
  await prisma.user.create({
    data: {
      username: username,
      email: email,
      name: nameString,
      hash: hash,
    },
  });
}

async function deleteSingle(userId) {
  await prisma.user.delete({
    where: { id: userId },
  });
}

async function readSingleFromEmail(userEmail) {
  const user = await prisma.user.findFirst({
    where: { email: userEmail },
  });
  return user;
}

async function readSingleFromId(userId) {
  const user = await prisma.user.findFirst({
    where: { id: userId },
  });
  return user;
}

async function updateInfo(userId, newEmail, newUsername) {
  const currentUser = await readSingleFromId(userId);
  const newUser = { ...currentUser };
  newUser.email = newEmail.length > 0 ? newEmail : currentUser.email;
  newUser.username =
    newUsername.length > 0 ? newUsername : currentUser.username;
  await prisma.user.update({
    where: { id: userId },
    data: newUser,
  });
}

async function updatePassword(userId, newHash) {
  const currentUser = await readSingleFromId(userId);
  const newUser = { ...currentUser, hash: newHash };
  await prisma.user.update({
    where: { id: userId },
    data: newUser,
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
