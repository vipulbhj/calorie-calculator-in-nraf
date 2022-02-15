const { join } = require("path");
const cookie = require("cookie");
const NRAF = require("@nraf/core");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const DOMPurify = require("isomorphic-dompurify");
const db = require("../db");
const Config = require("../config");

const router = NRAF.Router();

router.get("/signup", (_, res) => {
  res.render("signup", {
    headerButtonText: "Login",
    headerButtonLink: "/login",
  });
});

router.get("/login", (_, res) => {
  res.render("login", {
    headerButtonText: "Signup",
    headerButtonLink: "/signup",
  });
});

router.post("/signup", (req, res) => {
  const email = DOMPurify.sanitize(req.body.email);
  const username = DOMPurify.sanitize(req.body.username);
  const password = DOMPurify.sanitize(req.body.password);

  // Validate user input
  if (!(username && email && password)) {
    res.setStatus(400);
    return res.json({
      status: "error",
      message: "All fields are required",
    });
  }

  db.serialize(async () => {
    const encryptedPassword = await bcrypt.hash(password, 10);

    db.run(
      `INSERT INTO users(username, email, password) VALUES(?, ?, ?)`,
      [username, email, encryptedPassword],
      (err) => {
        if (err) {
          return res.json({
            status: "error",
            message: err.message,
          });
        }
        return res.json({
          status: "ok",
        });
      }
    );
  });
});

router.post("/login", (req, res) => {
  const email = DOMPurify.sanitize(req.body.email);
  const password = DOMPurify.sanitize(req.body.password);

  db.serialize(() => {
    db.get(
      `SELECT id, username, email, password, role, daily_calorie_limit from users WHERE email=?`,
      [email],
      async (err, user) => {
        if (err) {
          return res.json({
            status: "error",
            message: err.message,
          });
        }

        const isCorrectPassword = await bcrypt.compare(password, user.password);
        if (isCorrectPassword) {
          const token = jwt.sign(
            {
              id: user.id,
              role: user.role,
              email: user.email,
              username: user.username,
              daily_calorie_limit: user.daily_calorie_limit,
            },
            Config.JWT_SECRET
          );

          try {
            await new Promise((resolve, reject) => {
              db.run(
                "UPDATE users SET token=? WHERE id=?;",
                [token, user.id],
                (err) => {
                  if (err) reject(err);
                  resolve();
                }
              );
            });

            res.setHeader(
              "Set-Cookie",
              cookie.serialize("token", token, {
                httpOnly: true,
                maxAge: 60 * 60 * 24 * 7, // 1 week
              })
            );
            return res.json({
              status: "ok",
              token: token,
              message: "Success",
            });
          } catch (err) {
            if (err) {
              return res.json({
                status: "error",
                message: err.message,
              });
            }
          }
        } else {
          return res.json({
            status: "ok",
            token: null,
            message: "Incorrect email or password",
          });
        }
      }
    );
  });
});

router.get("/logout", (_, res) => {
  res.setHeader(
    "Set-Cookie",
    cookie.serialize("token", "", {
      maxAge: 0,
      httpOnly: true,
    })
  );
  res.redirect("/login");
});

module.exports = router;
