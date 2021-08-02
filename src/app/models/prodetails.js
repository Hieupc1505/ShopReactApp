const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const proDetail = new Schema({
    source: {
        type: String,
    },
    brand: {
        type: String,
    },
    material: {
        type: String,
    },
    size: {
        type: String,
    },
    safe: {
        type: String,
    },
});

module.exports = mongoose.model("prodetails", proDetail);
