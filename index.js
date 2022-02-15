const { join } = require("path");
const NRAF = require("@nraf/core");
const Config = require("./config");
const AuthController = require("./Controllers/AuthController");
const CalorieController = require("./Controllers/CalorieController");
const AdminCalorieController = require("./Controllers/Admin/AdminCalorieController");
const AuthMiddleware = require("./Middlewares/AuthMiddleware");
const isAdminUserMiddleware = require("./Middlewares/IsAdminMiddleware");

const app = NRAF();
const PORT = Config.PORT;

app.set("views", join(__dirname, "views"));
app.set("public", join(__dirname, "public"));

app.use("/", AuthController);

app.scope("web", [AuthMiddleware], (scope) => {
  scope.use("/", CalorieController);
});

app.scope("admin", [AuthMiddleware, isAdminUserMiddleware], (scope) => {
  scope.use("/admin", AdminCalorieController);
});

app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`);
});
