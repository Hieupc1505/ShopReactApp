const CategoryDB = require("../models/category");
const createError = require("http-errors");

class categoryCtrl {
    //[GET] /api/categories
    async getCategory(req, res) {
        try {
            const data = await CategoryDB.find().select("-des");
            res.json({
                success: true,
                categories: data,
            });
        } catch (err) {
            res.status(err.status || 500).json({
                success: false,
                msg: err.message || "Internal server error",
            });
        }
    }
    //[POST] /api/categories
    async postCategory(req, res, next) {
        const data = req.body;
        try {
            if (!data) throw new createError.BadRequest("Category is empty!!");
            const newCategory = await CategoryDB.create(data);
            res.json({
                success: true,
                newCategory,
            });
        } catch (err) {
            // console.log(err);
            res.status(err.status || 500).json({
                success: false,
                msg: err.message || "Internal Server Errror",
            });
        }
    }
}

module.exports = new categoryCtrl();
