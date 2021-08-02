const Joi = require("joi");

const schema = Joi.object({
    email: Joi.string().trim().email().required(),
    password: Joi.string().trim().min(6).required(),
});

module.exports = schema;
