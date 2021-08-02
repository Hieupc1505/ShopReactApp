require("dotenv").config();
const cloudinary = require("cloudinary");
const { CLOUDINARY_NAME, COULDINARY_API_KEY, CLOUDINARY_API_SECRET } =
    process.env;

const uploadImage = async () => {
    try {
        const fileStr = req.body.file;
        const uploadedResponse = await cloudinary.uploader.upload(fileStr, {
            upload_preset: "shopfull",
        });
        console.log(uploadedResponse);
        res.json({ msg: "AYAYAyayay" });
    } catch (err) {
        console.log(err);
    }
};

const getImageFromFolder = () => {
    const { resources } = await cloudinary.search
        .expression("folder : shopfull")
        .sort_by("public_id", "desc")
        .max_results(30)
        .execute();
    const pulicIds = resources.map((file) => file.public_id);
    res.send(pulicIds);
};
