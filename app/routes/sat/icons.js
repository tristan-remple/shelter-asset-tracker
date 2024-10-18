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
        var newPath = `client/public/img/${req.body.date}-${req.body.name}.${req.body.ext}`
        _fs.renameSync(files[0].path, newPath);
    }

    next()
};

// Import item controller
const iconController = require('../../controllers/iconController');

// Define routes for handling item operations
router.route('/')
    .get(iconController.getAllIcons)
    .post(admin, upload.any(), rename, iconController.createNewIcon);

router.route('/:id')
    .get(iconController.getIconById, iconController.sendIcon)
    .delete(admin, iconController.getIconById, iconController.deleteIcon);

module.exports = router;