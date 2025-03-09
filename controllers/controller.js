// const db = require("../db/queries");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const comment = require("./commentController")
const post = require("./postController");
const user = require("./userController");

module.exports = {
  comment,
  post,
  user,
};
