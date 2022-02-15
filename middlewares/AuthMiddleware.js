const db = require("../db");
const cookie = require("cookie");
const jwt = require("jsonwebtoken");
const Config = require("../config");

const verifyToken = async (req, res, next) => {
  const cookies = cookie.parse(req.headers.cookie || "");
  const token = req?.body?.token || cookies?.token;

  if (!token) {
    return res.redirect("/login");
  }

  try {
    const user = await new Promise((resolve, reject) => {
      db.get("SELECT id FROM users where token=?;", [token], (err, user) => {
        if (err) reject(err);
        resolve(user);
      });
    });

    if (!user || Object.keys(user).length === 0) return res.redirect("/login");

    req.user = jwt.verify(token, Config.JWT_SECRET);
    return next();
  } catch (err) {
    console.error(err);
    return res.redirect("/login");
  }
};

module.exports = verifyToken;
