const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models/user.models");
const createError = require("../helpers/createError");
const { SECRET_KEY } = process.env;

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

async function login(req, res, next) {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        throw (createError(401, "Email or password is wrong"));
    }

    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
        throw (createError(401, "Email or password is wrong"));
    }

    const payload = {
        id: user._id
    };

    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "1h" });
    const { subscription } = await User.findByIdAndUpdate(user._id, {token})

    return res.status(201).json({
        token,
        user: {
            email,
            subscription
        }
    })
};

module.exports = {
    signup,
    login,
};