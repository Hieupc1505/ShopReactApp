const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const prousersideSchema = Schema({
    rated: {
        type: Number,
        default: 0,
    },
    saled: {
        type: Number,
        default: 0,
    },
    liked: {
        type: Number,
        default: 0,
    },
});

module.exports = mongoose.model("prousersides", prousersideSchema);
