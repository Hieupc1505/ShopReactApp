require("dotenv").config();
const jwt = require("jsonwebtoken");
const joi = require("../helpers/joyInput");
const accDB = require("../models/acc");
const userDB = require("../models/user");
const createError = require("http-errors");
const sendMail = require("../Service/sendMail");
const { URL, ACCESSTOKEN_SECRET, REFRESHTOKEN_SECRET } = process.env;
const bcrypt = require("bcrypt");
const dateFormat = require("dateformat");

// route.post("/register", userCtl.register);
// route.get("/activate", useCtl.activate);
// route.post("/login", userCtl.login);

const handleError = (err) => {
    const errors = { email: "", password: "" };
    if (err.details) {
        err.details.map((item) => {
            errors[item.context.label] = item.message;
        });
    }

    return errors;
};

const getAccessToken = async (payload, timeout = "10h") => {
    return await jwt.sign(payload, ACCESSTOKEN_SECRET, {
        expiresIn: timeout,
    });
};
const getRefreshToken = async (payload, timeout = "5d") => {
    return await jwt.sign(payload, REFRESHTOKEN_SECRET, {
        expiresIn: timeout,
    });
};

class userCtl {
    //POST /register
    async register(req, res, next) {
        try {
            const data = await joi.validateAsync(req.body, {
                abortEarly: false,
            });
            const { email, password } = data;
            const isExists = await accDB.findOne({ email: email });

            if (isExists)
                next(createError.Unauthorized("Email is already exists"));

            const salt = await bcrypt.genSalt(10); //
            const hashPass = await bcrypt.hash(password, salt); //

            const tokenActivate = await getAccessToken(
                { email, password: hashPass },
                "2h"
            );
            console.log(tokenActivate);
            const url = `${URL}/user/activate/${tokenActivate}`;

            sendMail(email, url, "validate your email address");

            res.status(200).json({
                success: true, //
                msg: "Please check your email to activate your account",
            });
        } catch (err) {
            const errors = handleError(err);
            res.status(err.status || 500).json({
                success: false, //
                err: errors,
            });
        }
    }
    //[GET] /activate
    async activate(req, res, next) {
        const token = req.params.token;

        try {
            if (!token) throw new createError.Forbidden();

            const decoded = await jwt.verify(token, ACCESSTOKEN_SECRET);
            if (!decoded) throw new createError.Forbidden();
            const isMatch = await accDB.findOne({ email: decoded.email });
            if (isMatch) throw new createError.BadRequest("Email is exists!!");

            const { email, password } = decoded;

            const newAcc = await accDB.create({ email, password });
            const newUser = await userDB.create({
                userId: newAcc.id,
            });

            res.redirect("http://localhost:3000/login");
            // res.json({
            //     success: true, //
            //     msg: "Account is activated",
            // });
        } catch (err) {
            // console.log(err);
            next(err);
        }
    }
    //[GET] /refresh_token
    async refreshToken(req, res) {
        try {
            const refreshtoken = req.cookies._token;
            // console.log(refreshtoken);
            if (!refreshtoken)
                throw new createError.BadRequest("Refresh token were empty");
            jwt.verify(refreshtoken, REFRESHTOKEN_SECRET, async (err, data) => {
                if (err)
                    throw new createError.BadRequest(
                        "RefreshToken is not corrrect!!"
                    );
                const access = await getAccessToken({ id: data.id }, "2h");
                const refresh = await getRefreshToken({ id: data.id }, "2d");

                res.status(200).cookie("_token", refresh).json({
                    success: true,
                    accessToken: access,
                });
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                msg: err.message || "Fail to get refresh token",
            });
        }
    }
    //[POST] /loign
    async login(req, res, next) {
        const { email, password } = req.body; //
        try {
            if (!email || !password) {
                throw new createError.Unauthorized(
                    "Username or password is empty!!"
                );
            }

            const user = await accDB.findOne({ email });
            if (!user)
                throw new createError.Unauthorized(
                    "Email hoặc mật khẩu không đúng!!"
                );

            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch)
                throw new createError.Unauthorized(
                    "Email hoặc mật khẩu không đúng!!"
                );

            const accessToken = await getAccessToken({ id: user.id }, "2h");
            const refresh_token = await getRefreshToken({
                id: user.id,
            });
            // console.log(refresh_token);

            res.status(200)
                .cookie("_token", refresh_token, {
                    httpOnly: true,
                    path: "/user/refresh_token",
                    expiresIn: "1d",
                })
                .json({
                    success: true, //
                    msg: "Login is successful",
                    accessToken,
                });
        } catch (err) {
            // console.log(err.message);
            res.status(400).json({
                success: false,
                msg: err.message,
            });
        }
    }
    // [POST] /user/forget
    async forgetPass(req, res, next) {
        const { email } = req.body;

        const acc = await accDB.findOne({ email }).catch((err) => next(err));

        if (!acc) next(createError.BadRequest("Email chưa đăng ký!!"));

        const tokenForget = await getAccessToken(
            {
                _id: acc._id,
            },
            "10m"
        );

        const url = `http://localhost:3000/user/forget/account/${tokenForget}`;
        // console.log(tokenForget);
        sendMail(email, url, "reset password");
        res.status(200).json({
            success: true,
            msg: "Vui lòng kiểm tra Email để đặt lại mật khẩu!!",
        });
    }
    //[POST] /forget/account/:token
    async resetPass(req, res, next) {
        const token = req.params.token;
        const { password } = req.body;
        // console.log(token + "\n" + password);

        jwt.verify(token, ACCESSTOKEN_SECRET, async (err, decoded) => {
            if (err) next(err);
            const userId = decoded._id;
            const acc = await accDB.findOne({ _id: userId });
            if (!acc) next(createError.BadRequest());

            const salt = await bcrypt.genSalt(10); //
            const hashPass = await bcrypt.hash(password, salt);

            const newUser = await accDB
                .findOneAndUpdate(
                    { _id: userId },
                    { password: hashPass },
                    { new: true }
                )
                .catch((err) => next(err));
            res.json({
                success: true,
                msg: "Password was reseted!!",
            });
        });
    }
    //[GET] /verify
    async verify(req, res) {
        if (req.userId) {
            const userInfo = await userDB.findOne({ userId: req.userId });
            res.json({
                success: true,
                msg: "Authorization is successful!!",
                id: req.userId,
                user: userInfo,
            });
        }
        res.json({
            success: false,
            msg: "Internal Server Error",
        });
    }
    //[POST] /save/profile
    async saveInfo(req, res, next) {
        const data = req.body;
        // console.log(data);
        try {
            if (!data) throw new createError.BadRequest();
            const isCheck = await userDB.findOne({ userId: req.userId });
            if (isCheck.mark === 1)
                throw new createError.Conflict("Profile is exists!!");
            const newUser = {
                ...req.body,
                mark: 1,
            };
            await userDB.findOneAndUpdate({ userId: req.userId }, newUser);
            res.json({
                success: true,
                masg: "Your profile is updated!!",
                newUser,
            });
        } catch (err) {
            // console.log(err);
            next(err);
        }
    }
    //[GET] /loggout
    async logout(req, res) {
        try {
            res.clearCookie("_token", {
                path: "/user/refresh_token",
            });
            res.json({
                success: true,
                msg: "Loggouted !!",
            });
        } catch (err) {
            res.json({
                success: false,
                msg: "Internal server error",
            });
        }
    }
    //GET /info
    async getInfo(req, res) {
        try {
            const user = await userDB.findOne({ userId: req.userId });
            // const user = await accDB.findById(req.user.id).select("-password");
            if (!user) throw new createError.BadRequest("userId is not found!");
            res.json({
                success: true,
                user,
            });
        } catch (err) {
            res.json({
                success: false,
                msg: err.message || "Internal server error",
            });
        }
    }
    //[PUT] /user/update
    async updateProfile(req, res, next) {
        const data = req.body;
        const userId = req.userId;

        const user = await userDB
            .findOneAndUpdate({ userId }, data, { new: true })
            .catch((err) => next(err));

        res.json({
            success: true,
            user,
        });
        // const user = userDB.findOneAndUpdate({userId}, data)
    }

    async userOrder(req, res, next) {
        const userId = req.userId;
        const orderId = dateFormat();

        const user = await userDB.findOne({ userId });
        if (!user) next(createError.BadRequest());
        const oldOrder = user.orders;

        const newUser = await userDB
            .findOneAndUpdate(
                { userId },
                {
                    orders: [
                        ...oldOrder,
                        {
                            time: orderId,
                            ...req.body,
                        },
                    ],
                },
                { new: true }
            )
            .catch((err) => next(err));

        // await userDB.deleteMany({ cart: { select: true } });
        // console.log(newUser);
        // console.log(orderId);
        res.json({
            success: true,
            user: newUser,
        });
    }
    async userGetOrder(req, res, next) {
        const userId = req.userId;

        const user = await userDB.findOne({ userId }).catch(next);

        res.json({
            success: true,
            orders: user.orders,
        });
    }
    async testRoute(req, res) {
        const data = req.cookies._token;
        // console.log(data);
        res.json({ data });
    }
}

module.exports = new userCtl();
