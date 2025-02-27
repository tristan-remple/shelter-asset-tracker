const multer = require('multer');
const fs = require("fs");
const path = require("path");

// Ensure storage directory exists
const storagePath = "/var/storage";
if (!fs.existsSync(storagePath)) {
    fs.mkdirSync(storagePath, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, storagePath);
    },
    filename: function (req, file, cb) {
        const { date, filename, ext } = req.body; 
        if (!date || !filename || !ext) {
            return cb(new Error("Missing required upload fields."));
        }
        
        const safeFilename = `${date}-${filename}.${ext}`;
        console.log(safeFilename);
        cb(null, safeFilename);
    }
});

const upload = multer({ storage });

module.exports = upload;
