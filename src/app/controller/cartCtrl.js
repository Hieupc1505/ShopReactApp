const userDB = require("../models/user");
const proDB = require("../models/product");
const createError = require("http-errors");

class cartControler {
    //[GET] //carts
    async getCarts(req, res) {
        try {
            const user = await userDB.findOne({ userId: req.userId });

            res.json({
                success: true,
                cart: user.cart,
            });
        } catch (err) {
            res.json({
                success: false,
                msg: err.message || "Internal Server error for get all carts",
            });
        }
    }

    //[POST] /cart/add/:id
    async postCart(req, res) {
        try {
            const newUpdate = await userDB.findOneAndUpdate(
                { userId: req.userId },
                { cart: [...req.body] },
                { new: true }
            );
            res.json({
                success: true,
                cart: newUpdate.cart,
            });
        } catch (err) {
            res.json({
                success: false,
                msg: err.message || "Internal server error for post to cart",
            });
        }
    }
}

module.exports = new cartControler();
