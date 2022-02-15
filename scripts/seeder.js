const db = require("../db");
const bcrypt = require("bcryptjs");
const randomSeedData = require("./random-seed-data");

db.serialize(async () => {
  const username = "test1";
  const email = "test1@example.com";
  const password = "helloworld";
  const encPassword = await bcrypt.hash(password, 10);

  db.run(
    "INSERT INTO users(username, email, password) VALUES(?, ?, ?)",
    [username, email, encPassword],
    (err) => {
      if (err) {
        return console.error(err);
      }
    }
  ).run(
    `INSERT INTO intakes(user_id, name, calories, date_time) VALUES ${randomSeedData}`,
    [],
    (err) => {
      if (err) console.error(err);
    }
  );
});
