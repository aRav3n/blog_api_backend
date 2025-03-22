const jwt = require("jsonwebtoken");
require("dotenv");
const query = require("../db/queries");

const secretKey = process.env.SECRET_KEY;

async function gerUserData(req) {
  const authData = await getAuthData(req);
  if (authData) {
    const user = authData.user;
    user.iat = authData.iat;
    const { hash, ...objectToReturn } = user;
    return objectToReturn;
  }
  return null;
}

async function checkOwnership(req, res, type) {
  const db = query[type];
  const idString = `${type}Id`;
  const user = await gerUserData(req);
  if (!user) {
    res.status(403).json({ errors: ["you have to be logged in to do that"] });
    return false;
  }

  const id = Number(req.params[idString]);
  const item = await db.readSingle(id);
  if (!item) {
    res.status(404).json({ errors: [`${type} with an id of ${id} not found`] });
    return false;
  }

  const authorId = item ? item.authorId : null;
  const userIsPoster = authorId === user.id ? true : false;
  if (!userIsPoster) {
    res.status(403).json({
      errors: ["you don't have authorization to delete this item"],
    });
    return false;
  }
  return true;
}

function getTokenFromReq(req) {
  const bearerHeader = req.headers["authorization"];
  if (bearerHeader !== undefined) {
    const bearer = bearerHeader.split(" ");
    const token = bearer[bearer.length - 1];
    return token;
  }
  return null;
}

async function getAuthData(req) {
  let token = null;
  if (req.token) {
    token = req.token;
  } else {
    token = getTokenFromReq(req);
  }

  if (token) {
    return new Promise((resolve, reject) => {
      jwt.verify(token, secretKey, (err, authData) => {
        if (!authData) {
          resolve(null);
        } else if (err) {
          reject(err);
        } else if (authData) {
          resolve(authData);
        }
      });
    });
  }
}

async function sign(user) {
  return new Promise((resolve, reject) => {
    jwt.sign({ user }, secretKey, async (err, token) => {
      if (err) {
        reject(err);
      }
      resolve(token);
    });
  });
}

function verify(req, res, next) {
  const token = getTokenFromReq(req);
  if (token) {
    req.token = token;
  } else {
    res
      .sendStatus(403)
      .json({ message: ["you have to be logged in to do that"] });
  }

  next();
}

module.exports = {
  checkOwnership,
  gerUserData,
  sign,
  verify,
};
