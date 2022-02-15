# [NRAF](https://github.com/vipulbhj/nraf) MVC Template

This app was created as an experiment to try and build something none trivial with the [NRAF](https://github.com/vipulbhj/nraf) Framework. I am bad with deciding what to build, so I found some random take home assignment on the web and built to the spec of that.

## What this is

A simple calories intake calculator app, which allows users to enter there calorie intakes, set intake limits and highlight which intakes exceded the limit.

## Setup:

- Clone this repo.
- Run`yarn install` to download the dependencies.
- Run `node scripts/create-table.js` to create all the tables, our app needs.
- Run `node scripts/seeder.js` to seed some the tables with some initial random data and also create a normal user for you with the default credentials, which can be found in the `seeder.js` file.
- We are almost done, run `yarn start` to start the local development server, powered by `nodemon`, which will run on PORT 3000.

If everything goes well, you should see a message in the console indicating the same.

You can use the application on `http://localhost:3000`

## Creating Admin User:

Run `node scripts/create-admin.js` and follow the prompt to create a user with admin prviledges :)

## Features

- Authentication with `JSON Web Tokens`.
- Role based authorization.
- Intake management and reporting.
- Calorie limit and Intake highlighting.

## Libraries

- [NRAF](https://github.com/vipulbhj/nraf) as the base framework.
- `sqlite3` for database.
- `bcrypt` for password hashinh.
- `jsonwebtoken` for auth.
- `DOMPurify` for sanitizing user data.
- `nodemon` for development server.
- `cookie` for parsing and setting cookies.
