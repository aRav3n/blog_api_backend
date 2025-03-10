const { body, validationResult } = require("express-validator");
require("dotenv").config();

const db = require("../db/queries").comment;

const validateComment = [body("comment").trim()];

const create = [
  validateComment,
  async (req, res) => {
    const content = req.body.content;
    const postId = Number(req.params.postId);

    // need to update these later:
    const userId = 1;

    const comment = await db.create(content, userId, postId);
    return res.status(201).json(comment);
  },
];

async function deleteSingle(req, res) {
  const commentId = Number(req.params.commentId);

  // get logged in user's id
  const userId = 1;

  const comment = await db.readSingle(commentId);
  if (!comment) {
    return res.status(404).json({ errors: ["comment not found"] });
  }
  if (comment.authorId !== userId) {
    return res
      .status(403)
      .json({ errors: ["you're not authorized to delete that comment"] });
  }

  const deletedComment = await db.deleteSingle(commentId);
  if (!deletedComment) {
    return res.status(404).json({ errors: ["comment not found"] });
  }

  return res.status(204);
}

async function readRecentForPost(req, res) {
  const qty = 10;
  const postId = Number(req.params.postId);
  const comments = await db.readRecent(qty, postId);

  if (!comments) {
    return res.status(404).json({ errors: ["no comments found"] });
  }

  return res.status(200).json(comments);
}

async function update(req, res) {
  const id = Number(req.params.commentId);
  const content = req.body.content;

  const updatedComment = await db.update(id, content);

  if (!updatedComment) {
    return res.status(404).json({ errors: ["comment not found"] });
  }

  return res.status(200).json(updatedComment);
}

module.exports = {
  create,
  deleteSingle,
  readRecentForPost,
  update,
};
