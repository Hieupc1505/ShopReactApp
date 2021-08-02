require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const route = require("./src/routes/index");
const db = require("./src/app/config/db");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const createError = require("http-errors");
const methodOverride = require("method-override");
const path = require("path");
// const uploadImage = require("./src/app/Service/cloudinary");

const app = express();
db.connect();

app.use(
    cors({
        credentials: true,
        origin: ["http://localhost:3000", "http://localhost:27017"],
        exposedHeaders: ["set-cookie"],
    })
);
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(methodOverride("_method"));
app.use(
    fileUpload({
        useTempFiles: true,
    })
);

route(app);

if (process.env.NODE_ENV === "production") {
    app.use(express.static("client/build"));
    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "client", "build", "index.html"));
    });
}

app.use((req, res, next) => {
    next(createError.NotFound("Page is not found"));
});
app.use((err, req, res, next) => {
    // console.log(err.message);
    res.status(err.status || 500)
        .json({
            sucess: false,
            msg: err.message || "Internal Server errorrs",
        })
        .end();
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log("App is running...!!");
});
