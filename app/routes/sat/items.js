const express = require('express');
const router = express.Router();
const admin = require('../../middleware/admin');
const auth = require('../../middleware/auth');
const facility = require('../../middleware/facility');
const multer = require('multer');
var _fs = require("fs");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'client/public/attachments');
    }
})
const upload = multer({ storage: storage });

const rename = function (req, res, next) {
    var files = req.files;
    console.log(req.body.attachment);
    console.log(req.body.attachment.files);
    if (files) {
        //Move file to the deployment folder.
        var _fs = require("fs");
        var newPath = `../../../../var/storage/${req.body.date}-${req.body.src}.${req.body.ext}`;
        _fs.renameSync(files[0].path, newPath);
    };

    next();
};


// Import item controller
const itemController = require('../../controllers/itemController');

// Define routes for handling item operations
router.route('/')
    .get(admin, itemController.getAllItems)
    .post(itemController.checkFacility, auth, facility, itemController.createNewItem);

router.route('/deleted')
    .get(admin, itemController.getDeleted);

router.route('/:id/restore')
    .get(admin, itemController.restoreDeleted);

router.route('/:id')
    .get(itemController.getItemById, auth, facility, itemController.sendItem)
    .put(itemController.getItemById, auth, facility, upload.any(), rename, itemController.updateItem)
    .delete(itemController.getItemById, auth, facility, itemController.deleteItem);

module.exports = router;