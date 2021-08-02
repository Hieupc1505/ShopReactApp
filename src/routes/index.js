const userRoute = require("./userRoute");
const upLoadImage = require("../app/Service/cloudinary");
const productRoute = require("./products");
const order = require("./order");
function route(app) {
    app.use("/user", userRoute);
    app.use("/service", upLoadImage);
    app.use("/api", productRoute);
    app.use("/order", order);
}

module.exports = route;
