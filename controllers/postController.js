const { body, validationResult } = require("express-validator");
require("dotenv").config();

const db = require("../db/queries").post;

const validateTitle = [body("title").trim()];
const validateContent = [body("content").trim()];

const create = [
  validateTitle,
  validateContent,
  async (req, res) => {
    // get author id from req
    const id = 1;

    const title = req.body.title;
    const content = req.body.content;
    const published = req.body.published ? req.body.published : false;

    const success = await db.create(title, id, content, published);
    if (!success) {
      return res.status(404).json({ errors: ["unable to create the post"] });
    }

    return res.status(201).json({ success: success });
  },
];

async function deleteSingle(req, res) {
  // verify that user is admin somehow
  const userIsAdmin = true;
  if (!userIsAdmin) {
    return res
      .status(403)
      .json({ errors: ["you don't have authorization to delete this post"] });
  }

  const id = Number(req.params.postId);

  const success = await db.deleteSingle(id);

  if (!success) {
    return res
      .status(404)
      .json({ errors: [`post with an id of ${id} not found`] });
  }

  return res.sendStatus(204);
}

async function readRecent(req, res) {
  const qty = 10;
  const recentPosts = await db.readRecent(qty);
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
    const postId = Number(req.params.postId);
    const title = req.body.title;
    const content = req.body.content;
    const published = req.body.published;

    await db.update(postId, title, content, published);

    return res.sendStatus(201);
  },
];

module.exports = {
  create,
  deleteSingle,
  readRecent,
  readSingle,
  update,
};
