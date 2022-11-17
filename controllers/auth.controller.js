const bcrypt = require("bcryptjs");
const { User } = require("../models/user.models");
const createError = require("../helpers/createError");

async function signup(req, res, next) {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
        throw (createError(409, 'Email in use'));
    }

    const hashPass = await bcrypt.hash(password, 10);
    const registerUser = await User.create({ email, password: hashPass });

    return res.status(201).json({
        user: {
            email: registerUser.email,
            subscription: registerUser.subscription,
        }
    });
};

module.exports = {
    signup,
};