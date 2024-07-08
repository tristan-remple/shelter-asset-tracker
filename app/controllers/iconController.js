const { models, Sequelize } = require('../data');
const fs = require("fs");

// using multer for files
const multer = require('multer');

// set multer to store the images in the img folder
// and keep the original filename
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

// apply settings to multer, which can now be used as a function/middleware
const upload = multer({
    storage: storage,
    fileFilter: imageOnly
}).single('file');

exports.getAllIcons = async (req, res, next) => {
    try {
        const icons = await models.Icon.findAll({   
            attributes: [
                'id', 
                'src',
                'name', 
                'alt'
            ]
        });

        if (!icons) {
            return res.status(404).json({ error: 'Icons not found.' });
        }

        res.status(200).json(icons);

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server error.' });
    } 
};


exports.getIconById = async (req, res, next) => {
    try {
        const iconId = req.params.id; 

        const icon = await models.Icon.findOne({
            attributes: [
                'id', 
                'src',
                'name', 
                'alt',
                'createdAt', 
                'updatedAt'
            ],
            where: { id: iconId }
        });

        if (icon.id === null) {
            return res.status(404).json({ error: 'Icon not found.' });
        }

        req.data = icon;
        next();

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server error.' });
    }
};

exports.sendIcon = async (req, res, next) => {
    return res.status(200).json(req.data);
};

exports.createNewIcon = async (req, res, next) => {
    try {
        const { file, name, date, ext } = req.body;
        req.fileName = `${date}${name}.${ext}`;
        const src = `/client/public/img/${req.fileName}`;
        
        const existingIcon = await models.Icon.findOne({ where: { name } });
        if (existingIcon) {
            return res.status(400).json({ error: 'Icon already exists.' });
        }

        // call the multer upload function
        // note that this will overwrite files if overlap occurs
        upload(req, res, function(err) {
            // this error was set in the fileFilter for invalid mimetypes
            if (err === "Photo must be an image.") { 
                console.log(err)
                res.status(401).send(err);

            // errors other than the one we sent might be on our end
            } else if (err) {
                console.log(err)
                res.status(500).send(err);

            // no error: file upload success
            } else {
                // put database stuff 
                const newIcon = models.Icon.create({
                    src: src,
                    name: name, 
                    alt: `${name} logo`
                });
                
                const createResponse = {
                    id: newIcon.id,
                    src: newIcon.src,
                    name: newIcon.name,
                    alt: newIcon.alt,
                    createdAt: newIcon.createdAt,
                    success: true
                };
                return res.status(201).json(createResponse);
            }
        });
        
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server error' });
    }
};


exports.updateIcon = async (req, res, next) => {
    try {
        const iconId = req.params.id;
        const { src, name, alt } = req.body;

        const icon = await models.Icon.findByPk(iconId);

        if (!icon) {
            return res.status(404).json({ error: 'Icon not found.' });
        }

        icon.set({
            src: src,
            name: name,
            alt: alt
        });

        const updateResponse = {
            src: icon.src,
            name: icon.name,
            alt: icon.alt,
            success: true
        }

        await icon.save();

        return res.status(200).json(updateResponse);

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server error.' });
    }
};

exports.deleteIcon = async (req, res, next) => {
    try {
        const iconId = req.params.id;
        const { name } = req.body;

        const icon = await models.Icon.findByPk(iconId);

        if (!icon || icon.name !== name ) {
            return res.status(404).json({ error: 'Icon not found.' });
        }

        const deletedIcon = await icon.destroy({
            force: true     // No soft deletes on Icons
        });

        const deleteResponse = {
            iconId: deletedIcon.id,
            src: deletedIcon.src,
            name: deletedIcon.name,
            alt: deletedIcon.alt,
            deletedAt: deletedIcon.deletedAt,
            success: true
        };

        return res.status(200).json(deleteResponse);

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server error.' });
    }
};