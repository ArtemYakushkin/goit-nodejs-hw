const express = require("express");
const router = express.Router();
const authController = require("../../controllers/auth.controller");
const { ctrlWrapper } = require("../../helpers/ctrlWrapper");
const { validation } = require("../../middlewares/validation");
const authenticate = require("../../middlewares/authenticate");
const { registerSchema, loginSchema } = require("../../models/user.models");

router.post("/signup", validation(registerSchema), ctrlWrapper(authController.signup));
router.post("/login", validation(loginSchema), ctrlWrapper(authController.login));
router.get("/logout", authenticate, ctrlWrapper(authController.logout));

module.exports = router;