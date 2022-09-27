const route = require("express").Router();
const userCtl = require("../app/controller/userCtl");
const auth = require("../app/middleware/authToken");

route.post("/register", userCtl.register);
route.get("/activate/:token", userCtl.activate);

route.post("/login", userCtl.login);
route.get("/logout", userCtl.logout);
route.get("/verify", auth.authToken, userCtl.verify);
route.post("/save/profile", auth.authToken, userCtl.saveInfo);
route.get("/refresh_token", userCtl.refreshToken);
route.get("/info", auth.authToken, userCtl.getInfo);
route.put("/update", auth.authToken, userCtl.updateProfile);
route.get("/test", userCtl.testRoute);
route.post("/forget", userCtl.forgetPass);
route.post("/forget/account/:token", userCtl.resetPass);

route
    .post("/order", auth.authToken, userCtl.userOrder)
    .get("/order", auth.authToken, userCtl.userGetOrder);
module.exports = route;
