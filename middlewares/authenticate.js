const jwt = require("jsonwebtoken");
const createError = require("../helpers/createError");
const { User } = require("../models/user.models");
const { SECRET_KEY } = process.env;

async function authenticate(req, res, next) {
    try {
        const { authorization = "" } = req.headers;
        const [bearer = "", token = ""] = authorization.split(" ");
        if (bearer !== "Bearer" || !token) {
            throw createError(401);
        }
        try {
            const { id } = jwt.verify(token, SECRET_KEY);
            const user = await User.findById(id);
            if (!user || !user.token || user.token !== token) {
                throw Error("Unauthorized");
            }
            req.user = user;
            next();
        } catch (error) {
            throw createError(401, error.message);
        }
    } catch (error) {
        next(error);
    }
};

module.exports = authenticate;