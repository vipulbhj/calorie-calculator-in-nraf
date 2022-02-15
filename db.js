const { join } = require("path");
const sqlite3 = require("sqlite3").verbose();
const Config = require("./config");

const db = new sqlite3.Database(
  join(__dirname, "db", Config["DB_NAME"]),
  (err) => {
    if (err) {
      return console.error(err.message);
    }
  }
);

module.exports = db;
