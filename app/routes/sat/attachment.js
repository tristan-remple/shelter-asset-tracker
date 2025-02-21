const express = require('express');
const router = express.Router();
const admin = require('../../middleware/admin');
const multer = require('multer');
var _fs = require("fs");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'client/public/img');
    }
})
const upload = multer({ storage: storage });

const rename = function (req, res, next) {
    var files = req.files;
    if (files) {
        //Move file to the deployment folder.
var _fs = require("fs");
var newPath = `dist/img/${req.body.date}-${req.body.name}.${req.body.ext}`
        _fs.renameSync(files[0].path, newPath);
    }

    next()
};

// Import item controller
const attachmentController = require('../../controllers/attachmentController');

// Define routes for handling item operations
router.route('/')
    .post(admin, upload.any(), rename, attachmentController.createNewIcon);

router.route('/delete')
    .post(admin, attachmentController.deleteAttachments);

module.exports = router;