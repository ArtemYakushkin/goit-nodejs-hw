const express = require("express");
const router = express.Router();
const authController = require("../../controllers/auth.controller");
const { ctrlWrapper } = require("../../helpers/ctrlWrapper");
const { validation } = require("../../middlewares/validation");
const { registerSchema } = require("../../models/user.models");

router.post("/signup", validation(registerSchema) ,ctrlWrapper(authController.signup));

module.exports = router;