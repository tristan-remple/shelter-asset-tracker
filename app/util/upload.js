/*
    Functions for uploading and saving images.
 */
const multer = require('multer');

// apply settings to multer, which can now be used as a function/middleware
exports.upload = (req, file) => {
    // set multer to store the images in the img folder
    const storage = multer.diskStorage({
        destination: function (req, file, callback) {
            callback(null, 'client/public/img');
        },
        filename: function (req, file, callback) {
            callback(null, req.fileName);
        }
    });

    // set multer to only accept images
    const imageOnly = (req, file, cb) => {
        if (file.mimetype.includes('image')) {
            cb(null, true);
        } else {
            cb("Photo must be an image.", false);
        }
    }

    multer({
        storage: storage,
        fileFilter: imageOnly
    }).single('file');
}