require("dotenv").config();
const cloudinary = require("cloudinary");
const route = require("express").Router();
const fs = require("fs");

const { CLOUDINARY_NAME, COULDINARY_API_KEY, CLOUDINARY_API_SECRET } =
    process.env;

cloudinary.config({
    cloud_name: CLOUDINARY_NAME,
    api_key: COULDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
});
route.post("/upload", async (req, res) => {
    try {
        let imgArr = [];
        const { files } = req.files;

        if (!files || files.length === 0)
            return res
                .status(400)
                .json({ success: false, msg: "No file were upload" });

        const isArr = Array.isArray(files);

        if (isArr) {
            files.forEach((file) => {
                if (file.size > 1024 * 1024) {
                    removeTmp(file.tempFilePath);
                    return res
                        .status(400)
                        .json({ success: false, msg: "Size too large" });
                }

                if (
                    file.mimetype != "image/jpeg" &&
                    file.mimetype !== "image/png"
                ) {
                    removeTmp(file.tempFilePath);

                    return res.status(400).json({
                        success: false,
                        msg: "File format is incorrect",
                    });
                }
                imgArr.push(
                    cloudinary.v2.uploader.upload(file.tempFilePath, {
                        folder: "shopfull",
                    })
                );
            });

            await Promise.all(imgArr)
                .then((data) => {
                    let newData = data.map((item) => {
                        return { public_id: item.public_id, url: item.url };
                    });
                    return newData;
                })
                .then((data) => {
                    res.json({
                        success: true,
                        imgs: data,
                    });
                })
                .catch((err) => {
                    res.json({
                        success: false,
                        msg: err.message || "Internal server error",
                    });
                });
            return;
        }

        if (files.size > 1024 * 1024) {
            removeTmp(file.tempFilePath);
            return res
                .status(400)
                .json({ success: false, msg: "Size too large" });
        }

        if (files.mimetype != "image/jpeg" && files.mimetype !== "image/png") {
            removeTmp(files.tempFilePath);

            return res
                .status(400)
                .json({ success: false, msg: "File format is incorrect" });
        }
        cloudinary.v2.uploader.upload(
            files.tempFilePath,
            {
                folder: "shopfull",
            },
            (err, result) => {
                if (err)
                    res.json({ success: false, msg: "Internal server error" });
                res.json({
                    success: true,
                    imgs: [result],
                });
            }
        );
    } catch (err) {
        return res.json({
            success: false,
            msg: "Internal server error",
        });
    }
});
route.post("/destroy", (req, res) => {
    const { public_id } = req.body;
    if (!public_id)
        res.status(400).json({
            success: false,
            msg: "No images Selected",
        });
    cloudinary.v2.uploader.destroy(public_id, async (err, result) => {
        if (err) throw err;
        res.json({
            success: true,
            msg: "Deleted image",
        });
    });
});

const removeTmp = (path) => {
    fs.unlink(path, (err) => {
        if (err) throw err;
    });
};

module.exports = route;
