const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cateSchema = new Schema({
    name: {
        type: String,
        lowercase: true,
        required: [true, "Name of Category is requied!!"],
    },
    des: {
        type: String,
        default: null,
    },
});

module.exports = mongoose.model("categories", cateSchema);
