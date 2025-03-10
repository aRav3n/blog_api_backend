// const db = require("../db/queries");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const { log } = require("console");
require("dotenv").config();

const db = require("../db/queries").user;

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

const validateUpdate = [
  body("name").trim(),
  body("username").trim(),
  body("email").trim().isEmail().withMessage(emailErr),
];

const validatePassword = [
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

    // verify that the email is unique
    const email = req.body.email;
    const usersWithThisEmail = await db.readSingleFromEmail(email);
    const emailIsUnique = usersWithThisEmail.length === 0 ? true : false;

    if (emailIsUnique) {
      const username = req.body.username;
      const nameString = req.body.name.length > 0 ? req.body.name : null;

      const password = req.body.password;
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(password, salt);

      const user = await db.create(email, hash, username, nameString);
      console.log(user);
      return res.send(user);
    }
    console.log("sorry this email isn't unique");
    return res
      .status(409)
      .json({ errors: ["a user with this email already exists"] });
  },
];

async function deleteSingle(req, res) {
  console.log(req.body);
  // need to get the id somehow
  const id = 0;

  // first need to verify that this is the user that is logged in
  // boolean set to true for now
  const loggedIn = false;

  if (loggedIn) {
    await db.deleteSingle(id);
  }

  // then do I need to do a res.redirect? Need to look into how the API backend works

  return;
}

async function readFromEmail(req, res) {
  const password = req.body.password;
  const email = req.body.email;

  const user = await db.readSingleFromEmail(email);
  const passwordIsValid = bcrypt.compareSync(password, user.hash);

  if (passwordIsValid) {
    return res.send(user);
  }
  console.error("incorrect password");
  return;
}

async function readFromId(req, res) {
  // need to get the id somehow
  const id = 0;

  const loggedIn = true;

  if (loggedIn) {
    db.readSingleFromId(id);
  }

  return;
}

const updateInfo = [
  validateUpdate,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    // need to get the id somehow
    const id = 0;

    // need to verify that this is the user that is logged in
    // boolean set to true for now
    const loggedIn = true;

    if (loggedIn) {
      const email = req.body.email;
      const username = req.body.username;
      const nameString = req.body.name;
      await db.updateInfo(id, email, username, nameString);
    }
    return;
  },
];

const updatePassword = [
  validatePassword,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    // need to get the id somehow
    const id = 0;

    // need to verify that this is the user that is logged in
    // boolean set to true for now
    const loggedIn = true;

    if (loggedIn) {
      const password = req.body.password;
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(password, salt);

      await db.updatePassword(id, hash);
    }

    return;
  },
];

module.exports = {
  create,
  deleteSingle,
  readFromEmail,
  readFromId,
  updateInfo,
  updatePassword,
};
