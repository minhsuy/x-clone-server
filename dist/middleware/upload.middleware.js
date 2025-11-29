import multer from "multer";
const storage = multer.memoryStorage();
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
        cb(null, true);
    }
    else {
        cb(new Error("Only image files are allowed"), false);
    }
};
const limits = {
    fileSize: 5 * 1024 * 1024,
};
const upload = multer({
    storage,
    fileFilter,
    limits,
});
export default upload;
