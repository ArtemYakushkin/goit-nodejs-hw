const { Schema, model } = require("mongoose");
const Joi = require("joi");

const contactSchema = Schema(
    {
        name: {
            type: String,
            required: [true, 'Set name for contact'],
        },
        email: {
            type: String,
        },
        phone: {
            type: String,
        },
        favorite: {
            type: Boolean,
            default: false,
        },
        owner: {
          type: Schema.Types.ObjectId,
          ref: 'user',
        },
    }
);

const addSchema = Joi.object({
  name: Joi.string().min(3).max(20).required(),
  email: Joi.string().email().required(),
  phone: Joi.string()
    .pattern(/^[0-9]+$/)
    .required(),
  favorite: Joi.bool(),
});

const schemaUpdate = Joi.object({
  name: Joi.string().min(3).max(20),
  email: Joi.string().email(),
  phone: Joi.string().pattern(/^[0-9]+$/),
  favorite: Joi.bool(),
}).min(1);

const schemaUpdateFavorite = Joi.object({
  favorite: Joi.bool().required(),
});

const Contact = model("contacts", contactSchema);

module.exports = {
    Contact,
    addSchema,
    schemaUpdate,
    schemaUpdateFavorite
};