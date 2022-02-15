const db = require("../db");

db.serialize(() => {
  db.run(`DROP TABLE IF EXISTS users;`)
    .run(
      `CREATE TABLE users(
      id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL,
      email TEXT NOT NULL,
      password TEXT NOT NULL,
      token TEXT,
      role INTEGER DEFAULT 0,
      daily_calorie_limit INTEGER DEFAULT 2100
    );`
    )
    .run(`DROP TABLE IF EXISTS intakes;`)
    .run(
      `CREATE TABLE intakes(
      id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      date_time TEXT NOT NULL,
      calories INTEGER DEFAULT 0,
      FOREIGN KEY(user_id) REFERENCES users(id)
    );`
    );
});
