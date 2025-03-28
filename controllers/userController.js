const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const db = require("../db/queries").user;
const security = require("../controllers/securityController");
const creatorSalt = bcrypt.genSaltSync(10);
const creatorHash = bcrypt.hashSync(process.env.CREATOR_PASSWORD, creatorSalt);

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
  body("creatorPassword").trim(),
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
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.log(errors);
        return res.status(422).json({ errors: errors.array() });
      }

      // verify that the email is unique
      const email = req.body.email;
      const usersWithThisEmail = await db.readSingleFromEmail(email);
      const emailIsUnique =
        !usersWithThisEmail || usersWithThisEmail.length === 0 ? true : false;

      if (emailIsUnique) {
        const username = req.body.username;
        const nameString = req.body.name.length > 0 ? req.body.name : null;

        const password = req.body.password;
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);

        const user = await db.create(email, hash, username, nameString);
        const token = security.sign(user);

        return res.status(201).json(token);
      }
      return res
        .status(409)
        .json({ errors: ["a user with this email already exists"] });
    } catch (err) {
      console.error(err);

      if (err.name === "JsonWebTokenError") {
        return res.status(500).json({ errors: ["Token generation failed"] });
      }

      return res.status(500).json({ errors: ["Server error"] });
    }
  },
];

async function deleteSingle(req, res) {
  const user = await security.gerUserData(req, res);
  if (!user) {
    return res
      .status(403)
      .json({ errors: ["you have to be logged in to do that"] });
  }
  const id = user.id;

  const success = await db.deleteSingle(id);
  if (!success) {
    return res
      .status(404)
      .json({ errors: [`user with an id of ${id} not found`] });
  }
  console.log(success);

  return res.sendStatus(204);
}

async function readFromEmail(req, res) {
  const password = req.body.password;
  const email = req.body.email;

  const user = await db.readSingleFromEmail(email);
  if (user) {
    const passwordIsValid = Object.hasOwn(user, "hash")
      ? bcrypt.compareSync(password, user.hash)
      : false;

    if (passwordIsValid) {
      const token = await security.sign(user);
      const { hash, ...userObject } = user;
      return res.status(200).json({ token, userObject });
    }

    return res.status(403).json({ errors: ["invalid password"] });
  }
  return res
    .status(404)
    .json({ errors: ["no account found with this login info"] });
}

async function readFromId(req, res) {
  // need to get the id somehow
  const id = 0;

  const loggedIn = true;

  if (loggedIn) {
    const user = await db.readSingleFromId(id);
    return res.status(200).json(user);
  }

  return res
    .status(401)
    .json({ errors: ["you have to be logged in to access that"] });
}

const updateInfo = [
  validateUpdate,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    // need to get the id somehow
    const id = 1;

    // need to verify that this is the user that is logged in
    // boolean set to true for now
    const loggedIn = true;
    if (!loggedIn) {
      return res
        .status(401)
        .json({ errors: ["you have to be logged in to access that"] });
    }
    const email = req.body.email;
    const username = req.body.username;
    const nameString = req.body.name;
    const success = await db.updateInfo(id, email, username, nameString);
    if (!success) {
      return res
        .status(404)
        .json({ errors: [`user with an id of ${id} not found`] });
    }

    return res.status(201);
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
    const id = 1;

    // need to verify that this is the user that is logged in
    // boolean set to true for now
    const loggedIn = true;
    if (!loggedIn) {
      return res
        .status(401)
        .json({ errors: ["you have to be logged in to access that"] });
    }

    const password = req.body.password;
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    const success = await db.updatePassword(id, hash);

    if (!success) {
      return res
        .status(404)
        .json({ errors: [`user with an id of ${id} not found`] });
    }

    return res.sendStatus(201);
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
