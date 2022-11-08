const express = require('express');
const router = express.Router();
const contactsOperations = require("../../models/contacts");
const { validateContact, validateId } = require('./validation');

router.get('/', async (req, res, next) => {
    const contacts = await contactsOperations.listContacts();
    res.json({ status: 'success', code: 200, data: { contacts } });
});

router.get('/:contactId', async (req, res, next) => {
  try {
    const contact = await contactsOperations.getContactById(req.params.contactId);
    if (contact) {
      return res.status(200).json({ status: 'success', code: 200, data: { contact } });
    }
    return res.status(404).json({ status: 'error', code: 404, message: 'Not Found' });
  } catch (error) {
    next(error);
  }
});

router.post('/', validateContact, async (req, res, next) => {
  try {
    const contact = await contactsOperations.addContact(req.body);
    res.status(201).json({ status: 'success', code: 201, data: { contact } });
  } catch (error) {
    next(error);
  }
});

router.delete('/:contactId', validateId, async (req, res, next) => {
  try {
    const contact = await contactsOperations.removeContact(req.params.contactId);
    if (contact) {
      return res.status(200).json({ status: 'success', code: 200, message: 'Contact deleted', data: { contact } });
    }
    return res.status(404).json({ status: 'error', code: 404, message: 'Not found' });
  } catch (error) {
    next(error);
  }
});

router.put('/:contactId', validateContact, validateId, async (req, res, next) => {
  try {
    const contact = await contactsOperations.updateContact(req.params.contactId, req.body);
    if (contact) {
      return res.status(201).json({ status: 'success', code: 201, data: { contact } });
    }
    return res.status(404).json({ status: 'error', code: 404, message: 'Missing fields' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
