const { join } = require("path");
const Config = require("./config");
const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database(join(__dirname, Config["DB_NAME"]), (err) => {
  if (err) {
    return console.error(err.message);
  }
});

module.exports = db;
