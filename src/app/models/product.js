const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const proSchema = new Schema(
    {
        proImage: {
            type: Array,
            default: [],
        },
        proName: {
            type: String,
            required: [true, "Product name is require!!"],
        },
        proPrize: {
            type: Number,
            required: [true, "Product prize is required!!"],
        },
        proPromo: {
            type: Number,
            default: 0,
        },
        proStatus: {
            type: Number,
            enum: [0, 1],
            default: 1,
        },
        proInfo: {
            type: Schema.Types.ObjectId,
            ref: "prodetails",
            default: null,
        },
        categoryId: {
            type: Schema.Types.ObjectId,
            ref: "categories",
        },
        prouserside: {
            type: Schema.Types.ObjectId,
            ref: "prousersides",
            default: null,
        },
        proSaled: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("products", proSchema);
