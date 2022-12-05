const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models/user.models");
const createError = require("../helpers/createError");
const { SECRET_KEY } = process.env;
const { uuid } = require("uuid");
const { sendMail } = require("../utils/sendEmail");

async function signup(req, res, next) {
    const { email, password, subscription } = req.body;
    const user = await User.findOne({ email });
    if (user) {
        throw (createError(409, 'Email in use'));
    }

    const verifyToken = uuid();
    const hashPass = await bcrypt.hash(password, 10);
    const registerUser = await User.create({ email, password: hashPass, subscription, verifyToken });

    const data = {
        to: email,
        subject: "Confirmation of registration",
        html: `<p>Please, confirm your email <a href="http://localhost:3000/api/users/verify/${verifyToken}" target="_blank">${email}</a> to start using app</p>`,
    }; 

    const fromEmail = "beza2910@ukr.net";

    await sendMail(data, fromEmail);

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
    const userId = req.user._id;
    const user = await User.updateSubscription(userId, req.body);
    if (user) {
        return res.status(200).json({
            data: {
                email: user.email,
                subscription: user.subscription,
            },
        });
    }
    throw createError(401);
};

module.exports = {
    signup,
    login,
    logout,
    getCurrent,
    updateSubscription,
};