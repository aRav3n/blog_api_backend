const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function create(
  email,
  hash,
  username,
  name
) {
  const nameString = name ? name : null;
  await prisma.user.create({
    data: {
      username: username,
      email: email,
      name: name,
      hash: hash,
    },
  });
}

module.exports = { create };
