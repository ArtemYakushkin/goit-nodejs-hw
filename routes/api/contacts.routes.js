const express = require("express");
const router = express.Router();
const { ctrlWrapper } = require("../../helpers/ctrlWrapper");
const contactsOperations = require("../../controllers/contacts.controller");

router.get('/', ctrlWrapper(contactsOperations.getAll));
router.post('/', ctrlWrapper(contactsOperations.add));


module.exports = router;