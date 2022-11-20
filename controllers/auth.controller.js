const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models/user.models");
const createError = require("../helpers/createError");
const { SECRET_KEY } = process.env;

async function signup(req, res, next) {
    const { email, password, subscription } = req.body;
    const user = await User.findOne({ email });
    if (user) {
        throw (createError(409, 'Email in use'));
    }

    const hashPass = await bcrypt.hash(password, 10);
    const registerUser = await User.create({ email, password: hashPass, subscription });

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

async function logout(req, res, next) {
    const { _id } = req.user;
    await User.findByIdAndUpdate(_id, { token: "" });

    res.status(204);
};

async function getCurrent(req, res, next) {
    const { email,  subscription} = req.user;
    
    res.json({
        email,
        subscription
    });
};

async function updateSubscription(req, res, next) { 
    const { authorization = "" } = req.headers;
    const [bearer = "", token = ""] = authorization.split(" ");
    if (bearer !== "Bearer") {
        throw createError(401);
    };
    const { id } = jwt.verify(token, SECRET_KEY);
    const updatedUser = await User.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedUser) {
        throw createError(404);
    };
    res.json(updatedUser);
};

module.exports = {
    signup,
    login,
    logout,
    getCurrent,
    updateSubscription,
};