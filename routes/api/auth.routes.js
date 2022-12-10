const express = require("express");
const router = express.Router();
const authController = require("../../controllers/auth.controller");
const userController = require("../../controllers/user.controller");
const { ctrlWrapper } = require("../../helpers/ctrlWrapper");
const { validation } = require("../../middlewares/validation");
const authenticate = require("../../middlewares/authenticate");
const upload = require("../../middlewares/upload");
const { registerSchema, loginSchema, updateSubscriptionSchema } = require("../../models/user.models");

router.post("/signup", validation(registerSchema), ctrlWrapper(authController.signup));
router.post("/login", validation(loginSchema), ctrlWrapper(authController.login));
router.get("/logout", authenticate, ctrlWrapper(authController.logout));
router.get("/current", authenticate, ctrlWrapper(authController.getCurrent));
router.patch("/users", authenticate, validation(updateSubscriptionSchema), ctrlWrapper(authController.updateSubscription));
router.patch("/avatars", authenticate, upload.single("avatar"), ctrlWrapper(userController.updateAvatar));

router.get("/verify/:verifyToken", ctrlWrapper(userController.verifyEmail));
router.post("/verify", ctrlWrapper(userController.reVerifyEmail));

module.exports = router;