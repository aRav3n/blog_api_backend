const { body, validationResult } = require("express-validator");
require("dotenv").config();

const db = require("../db/queries").comment;

const validateComment = [
  body("comment").trim(),
]

const create = [
  validateComment,
  async (req, res) => {
    const content = req.body.content;

    // need to update these later:
    const postId = 1;
    const userId = 1;

    const comment = await db.create(content, userId, postId);
    return res.status(201).json(comment);
  }
]

module.exports = {
  create,
}