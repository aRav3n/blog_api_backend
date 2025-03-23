const { body, validationResult } = require("express-validator");
require("dotenv").config();

const db = require("../db/queries").comment;
const security = require("../controllers/securityController");

const validateComment = [body("comment").trim()];

async function verifyUserIsCommentOwner(req, res) {
  security.checkOwnership(req, res, "comment");
}

const create = [
  validateComment,
  async (req, res) => {
    const content = req.body.content;
    const postId = Number(req.params.postId);
    // console.log({ content, postId });

    // currently not requiring a login to post a comment
    /*
    const user = await security.gerUserData(req, res);
    if (!user) {
      return res
        .status(403)
        .json({ errors: ["you have to be logged in to do that"] });
    }
    const userId = user.id;
    */

    const comment = await db.create(content, null, postId);
    return res.status(201).json(comment);
  },
];

async function deleteSingle(req, res) {
  const commentId = Number(req.params.commentId);

  const user = await security.gerUserData(req, res);
  if (!user) {
    return res
      .status(403)
      .json({ errors: ["you have to be logged in to do that"] });
  }
  const userId = user.id;

  const commentOwner = await verifyUserIsCommentOwner(req, res);
  if (!commentOwner) {
    return;
  }

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
  const qty = false;
  const postId = Number(req.params.postId);
  const comments = await db.readRecent(qty, postId);

  if (!comments) {
    return res.status(404).json({ errors: ["no comments found"] });
  }

  return res.status(200).json(comments);
}

async function update(req, res) {
  const commentId = Number(req.params.commentId);

  const user = await security.gerUserData(req, res);
  if (!user) {
    return res
      .status(403)
      .json({ errors: ["you have to be logged in to do that"] });
  }

  const commentOwner = await verifyUserIsCommentOwner(req, res);
  if (!commentOwner) {
    return;
  }

  const content = req.body.content;

  const updatedComment = await db.update(commentId, content);

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
