const multer = require('multer');
const dotenv = require('dotenv');
dotenv.config();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, process.env.STORAGE);
    },
    filename: function (req, file, cb) {
        const { date, filename, ext } = req.body; 
        console.log(req.body)
        if (!date || !filename || !ext) {
            return cb(new Error("Missing required upload fields."));
        };
        
        const safeFilename = `${date}-${filename}`;
        console.log(safeFilename);
        cb(null, safeFilename);
    }
});

const upload = multer({ storage });

module.exports = upload;
