const { body, validationResult } = require("express-validator");
require("dotenv").config();

const db = require("../db/queries").post;
const security = require("../controllers/securityController");

const validateTitle = [body("title").trim()];
const validateContent = [body("content").trim()];

async function verifyUserIsPostOwner(req, res) {
  return await security.checkOwnership(req, res, "post");
}

const create = [
  validateTitle,
  validateContent,
  async (req, res) => {
    const user = await security.gerUserData(req);
    if (!user) {
      return res
        .status(403)
        .json({ errors: ["you have to be logged in to do that"] });
    }

    const title = req.body.title;
    const content = req.body.content;
    const published = req.body.published ? req.body.published : false;

    const success = await db.create(title, user.id, content, published);

    if (!success) {
      return res.status(404).json({ errors: ["unable to create the post"] });
    }

    return res.status(201).json({ success });
  },
];

async function deleteSingle(req, res) {
  const postOwner = await verifyUserIsPostOwner(req, res);
  if (!postOwner) {
    return;
  }

  const postId = Number(req.params.postId);
  const success = await db.deleteSingle(postId);

  if (!success) {
    return res
      .status(404)
      .json({ errors: [`post with an id of ${postId} not found`] });
  }

  return res.status(200).json({ messages: ["post deleted successfully"] });
}

async function readRecent(req, res) {
  // look at adding options later
  const qty = false;

  const user = await security.gerUserData(req);
  const authorId = user.id;

  const recentPosts = await db.readRecent(qty, authorId);
  return res.status(200).json(recentPosts);
}

async function readSingle(req, res) {
  const postId = Number(req.params.postId);
  const post = await db.readSingle(postId);
  return res.status(200).json(post);
}

const update = [
  validateContent,
  validateTitle,
  async (req, res) => {
    const postOwner = await verifyUserIsPostOwner(req, res);
    if (!postOwner) {
      return;
    }

    const postId = Number(req.params.postId);
    const title = req.body.title;
    const content = req.body.content;
    const published = req.body.published;


    const updatedPost = await db.update(postId, title, content, published);

    return res.status(201).json(updatedPost);
  },
];

module.exports = {
  create,
  deleteSingle,
  readRecent,
  readSingle,
  update,
};
