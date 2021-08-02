const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const accSchema = new Schema(
    {
        email: {
            type: String,
            required: [true, "Email is required"],
            lowercase: true,
        },
        password: {
            type: String,
            minLength: [6, "Minximum password is 6 characters"],
            require: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("account", accSchema);
