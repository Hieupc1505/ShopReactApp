require("dotenv").con;
const createError = require("http-errors");
const proDB = require("../models/product");
const userDB = require("../models/user");
const cetegoryDB = require("../models/category");
// const { MongoClient } = require("mongodb");
// const client = new MongoClient(
//     "mongodb+srv://hieupc:04092001hh@react-shop.lurdz.mongodb.net/react-app?retryWrites=true&w=majority"
// );

// const timeSlide = async (next) => {
//     const data = await proDB
//         .find()
//         .sort({ createAt: -1 })
//         .limit(10)
//         .catch((err) => next(err));
//     console.log(data);
//     return data;
// };
// const prizeSlide = async (next) => {
//     const data = await proDB
//         .find()
//         .sort({ proPrize: 1 })
//         .limit(10)
//         .catch((err) => next(err));
//     return data;
// };

const categorySlide = async (userId, num, next) => {
    const { cart } = await userDB.findOne({ userId }, { cart: 1 });
    num = parseInt(num);
    const arrCate = cart.map((item) => item.categoryId);

    const data = await proDB
        .find({
            categoryId: { $in: arrCate },
        })
        .limit(num)
        .catch((err) => next(err));

    if (data.lenght < num) {
        const add = await proDB
            .find({
                categoryId: { $not: arrCate },
            })
            .limit(num - data.length);
        data = [...data, ...add];
    }

    return data;
};

const saledSlide = async (num, next) => {
    num = parseInt(num);
    const data = await proDB
        .find()
        .sort({ proSaled: -1 })
        .limit(num)
        .catch((err) => next(err));
    return data;
};

const getCategoryId = async (arrText) => {
    return Promise.all(
        arrText.map((text) => {
            return cetegoryDB.find(
                {
                    name: {
                        $regex: new RegExp(text),
                    },
                },
                {
                    _id: 1,
                }
            );
        })
    );
};

const handleQuerySearch = (query) => {
    let arrText = query.split(" ");
    let arrSearch = arrText.reduce(
        (arr, text, index) => {
            if (index == 1) arr[index - 1] += " " + text;
            else if (index > 1) arr[index - 1] = arr[index - 2] + " " + text;
            return arr;
        },
        [arrText[0]]
    );
    let res = [...arrSearch, ...arrText];
    return res;
};

const getProByProName = (query) => {
    const arrSearch = handleQuerySearch(query);
    return Promise.all(
        arrSearch.map((item) => {
            return proDB.find(
                {
                    proName: {
                        $regex: new RegExp(item),
                    },
                },
                {
                    _id: 1,
                    proName: 1,
                    proPrize: 1,
                    proImage: 1,
                    proPromo: 1,
                    categoryId: 1,
                    updateAt: 1,
                }
            );
        })
    );
};

class proControl {
    //[GET] /api/products
    async getPros(req, res, next) {
        let { num } = req.query;
        num = parseInt(num);
        try {
            const pros = await proDB
                .find()
                .sort({ createAt: -1 })
                .limit(num)
                .populate({ path: "categories", select: "name" });

            if (!pros)
                throw new createError.InternalServerError(
                    "Not found any Products"
                );
            res.json({
                success: true,
                pros,
            });
        } catch (err) {
            res.json({
                success: false,
                msg: err.message || "Internal server error",
            });
        }
    }
    //[POST] /api/products
    async postPros(req, res, next) {
        let proPromo = req.body.proPromo || 0;

        const {
            name: proName,
            prize: proPrize,
            categoryId,
            images: proImage,
        } = req.body;
        try {
            if (!proName || !proPrize || !categoryId || !proImage)
                throw new createError.BadRequest("Your input Data is empty!!");
            let newPro = await proDB.create({
                proName,
                proPrize,
                proPromo,
                categoryId,
                proImage,
            });
            res.json({
                success: true,
                newPro,
            });
        } catch (err) {
            res.json({
                success: false,
                msg: err.message || "Internal server error",
            });
        }
    }
    //[GET] /api/products/:id
    async getSinglePro(req, res) {
        const { id } = req.params;
        try {
            if (!id) throw new createError.BadRequest("Product Id is Empty!!");

            const pro = await proDB.findById(id);

            res.json({
                success: true,
                pro,
            });
        } catch (err) {
            res.status(err.status || 500).json({
                success: false,
                msg: err.message || "Internal server error",
            });
        }
    }
    //[GET] /api/products/search?q=...
    async searchPro(req, res, next) {
        let q = req.query.q;
        q = q.trim();
        try {
            cetegoryDB
                .find(
                    {
                        name: {
                            $regex: new RegExp(q),
                        },
                    },
                    {
                        name: 1,
                    },
                    function (err, data) {
                        res.json({ data });
                    }
                )
                .limit(10);

            // await client.connect();
            // let collection = client.db("react-app").collection("categories");

            // const data = await collection
            //     .aggregate([
            //         {
            //             $search: {
            //                 autocomplete: {
            //                     query: `${q}`,
            //                     path: "name",
            //                     fuzzy: {
            //                         maxEdits: 2,
            //                     },
            //                 },
            //             },
            //         },
            //         {
            //             $limit: 5,
            //         },
            //         {
            //             $project: {
            //                 name: 1,
            //             },
            //         },
            //     ])
            //     .toArray();
            // console.log(data);
            // res.send({ data });
        } catch (err) {
            res.json({
                success: false,
                msg: err.message || "search categories fail!!",
            });
        }
    }
    //[GET] /api/page/searchtest

    //[GET] /api/page/searchtest
    async pageSearch(req, res, next) {
        let query = req.query.q;
        // const page = req.query.page;
        query = query.trim();

        let arrSearch = handleQuerySearch(query);

        try {
            let pros = [];
            let arrCateId = await getCategoryId(arrSearch);
            let newCateId = arrCateId.flatMap((item) => item);

            let arrId = newCateId.reduce((arr, cate) => {
                let check = arr.some(
                    (item) => item._id.toString() === cate._id.toString()
                );
                if (check) return arr;
                else {
                    arr.push(cate);
                    return arr;
                }
            }, []);

            pros = await proDB.find(
                {
                    categoryId: {
                        $in: arrId,
                    },
                },
                {
                    _id: 1,
                    proName: 1,
                    proPrize: 1,
                    proImage: 1,
                    proPromo: 1,
                    categoryId: 1,
                    updateAt: 1,
                }
            );

            const searchByProName = await getProByProName(query);
            const arrPros = searchByProName.flatMap((item) => item);

            res.json({
                success: true,
                pros: [...pros, ...arrPros],
                len1: pros.length,
                len2: arrPros.length,
            });
        } catch (err) {
            res.status(err.status || 500).json({
                success: false,
                msg: err.message || "Page search request fail!!",
            });
        }
    }
    async getSlide(req, res, next) {
        const { type, num } = req.query;

        let result = [];
        switch (type) {
            // case "prize":
            //     result = await prizeSlide(next);
            //     break;
            // case "time":
            //     result = await timeSlide(next);
            case "relative":
                let { userId } = req.query;
                result = await categorySlide(userId, num, next);
                break;
            case "saled":
                result = await saledSlide(num, next);
                break;
            case "category":

            default:
                result = [];
        }
        res.json({
            success: true,
            pros: result,
        });
    }
    // async getProByCateId(req, res, next) {
    //     const categoryId = req.params.categoryId;
    //     if (!categoryId) next(createError.BadRequest("Request fail!!"));

    //     const pros = await proDB.find({ categoryId }).catch((err) => next(err));

    //     res.json({
    //         success: true,
    //         pros,
    //     });
    // }

    //[PUT] /api/products/:id
    //[DELETE] /api/products/:id
}

module.exports = new proControl();
