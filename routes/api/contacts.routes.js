const express = require("express");
const router = express.Router();
const { ctrlWrapper } = require("../../helpers/ctrlWrapper");
const contactsOperations = require("../../controllers/contacts.controller");
const { validation } = require("../../middlewares/validation");
const { addSchema, schemaUpdate, schemaUpdateFavorite } = require("../../models/contact.models");

router.get('/', ctrlWrapper(contactsOperations.getAll));
router.get("/:contactId", ctrlWrapper(contactsOperations.getById));
router.post('/', validation(addSchema), ctrlWrapper(contactsOperations.add));
router.delete('/:contactId', ctrlWrapper(contactsOperations.removeById));
router.put('/:contactId', validation(schemaUpdate), ctrlWrapper(contactsOperations.updateById));
router.patch('/:contactId', validation(schemaUpdateFavorite), ctrlWrapper(contactsOperations.updateStatusContact));


module.exports = router;