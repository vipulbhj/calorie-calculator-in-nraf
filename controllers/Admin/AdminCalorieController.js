const db = require("../../db");
const NRAF = require("@nraf/core");
const DOMPurify = require("isomorphic-dompurify");

const router = NRAF.Router();

router.get("/", (req, res) => {
  db.all(
    "SELECT id, name, date_time, calories FROM intakes;",
    [],
    (err, intakes) => {
      if (err) {
        return res.send("Something went wrong");
      }

      return res.render("admin/intake/show", {
        isAdmin: true,
        headerButtonText: "Logout",
        headerButtonLink: "/logout",
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

router.get("/report", (req, res) => {
  db.get(
    "SELECT COUNT(id) as count, SUM(calories) as lastWeekCalorieCount FROM intakes WHERE DATETIME(date_time) > (SELECT DATETIME('now', '-7 day'));",
    [],
    (err, { count: lastWeekEnties, lastWeekCalorieCount }) => {
      if (err) {
        console.error(err);
        return res.send(err.message);
      }

      db.get(
        "SELECT COUNT(id) as count FROM intakes WHERE DATETIME(date_time) > (SELECT DATETIME('now', '-14 day'));",
        [],
        (err, { count: lastTwoWeekEntries }) => {
          if (err) {
            console.error(err);
            return res.send(err.message);
          }

          return res.render("admin/report", {
            isAdmin: true,
            lastWeekEnties,
            headerButtonText: "Logout",
            headerButtonLink: "/logout",
            secondLastWeekEntries: lastTwoWeekEntries - lastWeekEnties,
            avgCaloriesIntakeInLastWeek: lastWeekCalorieCount / lastWeekEnties,
          });
        }
      );
    }
  );
});

router.get("/intake/new", (_, res) => {
  res.render("intake/new", {
    isAdmin: true,
    headerButtonText: "Logout",
    headerButtonLink: "/logout",
  });
});

router.get("/intake/:intakeId/edit", (req, res) => {
  if (!req?.params?.intakeId) return res.send("Something went wrong");

  db.get(
    "SELECT name, date_time, calories FROM intakes WHERE id=?;",
    [req?.params?.intakeId],
    (err, intake) => {
      if (err) {
        return res.redirect("/admin/");
      }

      return res.render("admin/intake/edit", {
        id: req.params.intakeId,
        name: intake["name"],
        date_time: intake["date_time"],
        calories: intake["calories"],

        isAdmin: true,
        headerButtonText: "Logout",
        headerButtonLink: "/logout",
      });
    }
  );
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

router.post("/intake/:intakeId/update", (req, res) => {
  if (!req?.params?.intakeId) return res.send("Something went wrong");

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
      `UPDATE intakes SET name=?, date_time=?, calories=? WHERE id=?`,
      [name, date_time, caloriesInInt, req.params.intakeId],
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

router.post("/intake/:intakeId/delete", (req, res) => {
  if (!req?.params?.intakeId) return res.send("Something went wrong");

  db.serialize(() => {
    db.run(`DELETE FROM intakes WHERE id=?`, [req.params.intakeId], (err) => {
      if (err) {
        return res.json({
          status: "error",
          message: err.message,
        });
      }

      return res.json({
        status: "ok",
      });
    });
  });
});

module.exports = router;
