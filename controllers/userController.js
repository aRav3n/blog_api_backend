// const db = require("../db/queries");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const db = require("../db/queries").user;

// initialize error variable for use later
let errors = null;

const emailErr = "email must be a valid email";
const pwError = "Password must be between 6 and 16 characters";
const pwMatchError = "Passwords must match";
const validateUser = [
  body("name").trim(),
  body("username").trim(),
  body("email").trim().isEmail().withMessage(emailErr),
  body("password").trim().isLength({ min: 6, max: 16 }).withMessage(pwError),
  body("confirmPassword")
    .exists()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        return false;
      }
      return true;
    })
    .withMessage(pwMatchError)
    .trim(),
];

const create = [
  validateUser,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const email = req.body.email;
    const username = req.body.username;
    const name = req.body.name.length > 0 ? req.body.name : null;

    const password = req.body.password;
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    db.create(email, hash, username, name);

    res.redirect("/");
  },
];

module.exports = {
  create,
};
