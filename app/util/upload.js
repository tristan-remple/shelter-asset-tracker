/*
    Functions for uploading and saving images.
 */
const multer = require('multer');

// Create a multer instance to handle both file upload and form fields
exports.upload = async (req, file) => {
    console.log('upload');

    // Set multer to store the images in the img folder
    const storage = multer.diskStorage({
        destination: function (req, file, callback) {
            callback(null, 'client/public/img');
        },
        filename: function (req, file, callback) {
            console.log(file);
            console.log(file.name);
            callback(null, `${file.date}-${file.name}.${file.ext}`);
        }
    });

    // Set multer to only accept images
    const imageOnly = (req, file, cb) => {

        if (file.mimetype.includes('image')) {
            cb(null, true);
        } else {
            cb("Photo must be an image.", false);
        }
    };

    multer({
        storage: storage,
        fileFilter: imageOnly
    }).single('file');

    multer().fields([
        { name: 'name' },
        { name: 'date' },
        { name: 'ext' },
        { name: 'file' }
    ]);

    console.log(req.files);
}