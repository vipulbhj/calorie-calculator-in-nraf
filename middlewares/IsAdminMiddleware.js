const { ADMIN_ROLE_ID } = require("../config");

const isAdminUserMiddleware = (req, res, next) => {
  if (req?.user?.role === ADMIN_ROLE_ID) {
    next();
  } else {
    return res.redirect("/");
  }
};

module.exports = isAdminUserMiddleware;
