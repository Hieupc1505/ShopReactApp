const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
    {
        userName: {
            type: String,
            required: [true, "Please enter username"],
            lowercase: true,
            default: "user",
        },
        number: {
            type: String,
            minLength: [10, "Minimum number is 10 charactor"],
            maxLength: [10, "Please enter your phone number!!"],
            required: function () {
                return this.mark === 1;
            },
        },
        address: {
            type: Object,
            required: true,
            lowercase: true,
            required: function () {
                return this.mark === 1;
            },
        },
        avata: {
            type: Object,
            default: {},
        },
        cart: {
            type: Array,
            default: [],
        },
        role: {
            type: Number,
            default: 0,
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: "accounts",
        },
        mark: {
            type: Number,
            default: 0,
        },
        orders: {
            type: Array,
            default: [],
        },
    },
    {
        timestamps: true,
    }
);

userSchema.methods.updateOrders = function (orderData) {
    console.log(this);
};

module.exports = mongoose.model("userprofile", userSchema);
