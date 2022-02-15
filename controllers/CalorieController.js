const db = require("../db");
const NRAF = require("@nraf/core");
const DOMPurify = require("isomorphic-dompurify");
const { ADMIN_ROLE_ID, NORMAL_ROLE_ID } = require("../config");

const router = NRAF.Router();

router.get("/", (req, res) => {
  db.all(
    "SELECT id, name, date_time, calories FROM intakes WHERE user_id=?;",
    [req.user.id],
    (err, intakes) => {
      if (err) {
        return res.send("Something went wrong");
      }

      return res.render("intake/show", {
        headerButtonText: "Logout",
        headerButtonLink: "/logout",
        isAdmin: req.user.role === ADMIN_ROLE_ID,
        showShareButton: req.user.role === NORMAL_ROLE_ID,
        intakes: intakes.map((intake) => {
          if (intake.calories > req.user.daily_calorie_limit) {
            return {
              ...intake,
              isOverDailyCalorieCount: true,
            };
          }
          return {
            ...intake,
            isOverDailyCalorieCount: false,
          };
        }),
      });
    }
  );
});

router.get("/intake/new", (_, res) => {
  return res.render("intake/new", {
    showShareButton: true,
    headerButtonText: "Logout",
    headerButtonLink: "/logout",
  });
});

router.post("/intake/create", (req, res) => {
  const name = DOMPurify.sanitize(req?.body?.name);
  const date_time = DOMPurify.sanitize(req?.body?.date_time);
  const calories = DOMPurify.sanitize(req?.body?.calories);
  const caloriesInInt = calories && parseInt(calories, 10);

  // Validate user input
  if (!(name && date_time && calories)) {
    res.setStatus(400);
    return res.json({
      status: "error",
      message: "All fields are required",
    });
  }

  db.serialize(() => {
    db.run(
      `INSERT INTO intakes(name, user_id, date_time, calories) VALUES(?, ?, DATETIME(?), ?)`,
      [name, req.user.id, date_time, caloriesInInt],
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

module.exports = router;
