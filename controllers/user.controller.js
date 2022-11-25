const path = require("path");
const fs = require("fs/promises");
const Jimp = require("jimp");
const { User } = require("../models/user.models");

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

module.exports = {
    updateAvatar
};