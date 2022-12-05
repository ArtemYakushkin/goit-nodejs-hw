const path = require("path");
const fs = require("fs/promises");
const Jimp = require("jimp");
const { User } = require("../models/user.models");
const { NotFound, BadRequest } = require("http-errors");
const { sendEmail } = require("../utils/sendEmail");

const avatarsDir = path.join(__dirname, "../", "public/avatars");

async function updateAvatar(req, res) { 
    const { _id } = req.user;
    const { path: tempPath, originalname } = req.file;
    const uploadPath = path.join(avatarsDir, `${_id}`);
    const avatarPath = path.join(uploadPath, originalname);

    const [extn, name] = originalname.split('.').reverse();
    const avatarUrl = path.join('/avatars', `${name}-${_id}.${extn}`);

    try {
        const readFile = await Jimp.read(tempPath);
        await readFile.resize(250, 250).write(tempPath);
        await fs.mkdir(uploadPath);
        await fs.rename(tempPath, avatarPath);
        await User.findByIdAndUpdate(_id, { avatarUrl }, { new: true });
        res.json({
            status: "success",
            code: 200,
            data: {
                avatarUrl,
            },
        });
    } catch (error) {
        await fs.unlink(tempPath);
        throw error;
    };
};

async function verifyEmail(req, res) {
    const { verifyToken } = req.params;
    const user = await User.findOne({ verifyToken });

    if (!user) {
        throw new NotFound("User does not exist or is not verified");
    }

    await User.findByIdAndUpdate(user._id, { verifyToken: null, verify: true });

    res.json({
        status: "success",
        code: 200,
        message: "Email verified successfully",
    });
};

async function reVerifyEmail(req, res) { 
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
        throw new NotFound(`User with email ${email} does not exist`);
    }

    if (user.verify && !user.verifyToken) {
        throw new BadRequest("Verification has already been passed");
    }

    const data = {
        to: email,
        subject: "Confirmation of registration",
        html: `<p>Please, confirm your email <a href="http://localhost:3000/api/users/verify/${user.verifyToken}" target="_blank">${email}</a> to start using app</p>`,
    };

    const fromEmail = "beza2910@ukr.net";

    await sendEmail(data, fromEmail);

    res.json({
        status: "success",
        code: 200,
        message: "Verification email sent",
    });
};

module.exports = {
    updateAvatar,
    verifyEmail,
    reVerifyEmail,
};