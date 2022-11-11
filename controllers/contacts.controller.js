const { Contact } = require("../models/contact.models");
const { createError } = require("../helpers/createError");

async function getAll(req, res, next) {
    const contacts = await Contact.find();
    return res.json({ data: contacts });
};

async function add(req, res, next) {
    const newContact = await Contact.create({...req.body});
    return res.status(201).json({ data: { contact: newContact } });
};

async function removeById(req, res, next) {
    const { contactId } = req.params;
    const result = await Contact.findByIdAndRemove(contactId);
    if (!result) {
        throw createError(404, "Not found");
    }
    res.status(200).json({
        message: "contact deleted",
    });
};

module.exports = {
    getAll,
    add,
    removeById,
};