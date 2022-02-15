const db = require("../db");
const bcrypt = require("bcryptjs");
const Config = require("../config");

const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});

db.serialize(async () => {
  // Ask user for username, email and password
  let email, username, password;

  await new Promise((resolve, reject) => {
    readline.question(`Username: \n`, (inp) => {
      username = inp;
      readline.question(`Email: \n`, (inp) => {
        email = inp;
        readline.question(`Password: \n`, (inp) => {
          password = inp;
          readline.close();
          resolve();
        });
      });
    });
  });

  const encryptedPassword = await bcrypt.hash(password, 10);

  db.run(
    `INSERT INTO users(username, email, password, role) VALUES(?, ?, ?, ?)`,
    [username, email, encryptedPassword, Config["ADMIN_ROLE_ID"]],
    (err) => {
      if (err) {
        return console.error(err);
      }

      console.log("Admin created");
      console.log("Email: ", email);
      console.log("Password: ", password);
    }
  );
});
