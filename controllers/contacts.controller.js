const { Contact } = require("../models/contact.models");

async function getAll(req, res, next) {
    const contacts = await Contact.find();
    return res.json({ data: contacts });
};

async function add(req, res, next) {
    const newContact = await Contact.create({...req.body});
    return res.status(201).json({ data: { contact: newContact } });
}

module.exports = {
    getAll,
    add,
};