const models  = require('../data');
const { hashPassword, createReset, comparePasswords, checkPassword } = require('../util/password');
const sendEmail = require('../util/mail');

// set password reset request fields on the current user
exports.createRequest = async (req, res, next) => {
    try {
        const user = req.data;
        const resetRequest = await createReset();

        user.set({
            requestHash: resetRequest.requestHash,
            requestExpiry: resetRequest.requestExpiry
        });


        const { name, email, requestHash, requestExpiry } = user;
        if (!name || !email || !requestHash || !requestExpiry) {
            return res.status(400).json({ error: 'Bad request.' });
        }

        const emailResponse = await sendEmail(name, email, requestHash, requestExpiry);
        await user.save();

        const response = {
            success: true,
            emailSent: emailResponse
        };

        if (user.isNewUser){
            response = {
                userId: user.id,
                name: user.name,
                isAdmin: user.isAdmin,
                created: user.createdAt,
                success: true,
                emailSent: emailResponse
            };
            return res.status(201).json(response);
        }

        return res.status(200).json(response);

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server error.' });
    }
}

exports.resendRequest = async (req, res, next) => {
    const { email } = req.body;

    try {
        const user = await models.User.findOne({
            attributes: [
                'name',
                'requestHash',
                'requestExpiry',
            ],
            where: { email: email }
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        const { name, requestHash, requestExpiry } = user;
        if (!requestHash || !requestExpiry){
            return res.status(404).json({ error: 'Request not found.' });
        }
    
        const emailResponse = await sendEmail(name, email, requestHash, requestExpiry);
    
        const response = {
            success: true,
            emailSent: emailResponse
        };
    
        return res.status(200).json(response);

    } catch (err) {
        console.error(err)
        return res.status(500).json({ error: 'Server error.' })
    }
}

// set a new password for a user with a valid password request hash
exports.updatePassword = async (req, res, next) => {

    const hash = req.params.hash;
    const { email, password } = req.body;
    const validPassword = checkPassword(password);

    if ( !validPassword ) {
        return res.status(400).json({ error: 'Bad request.' });
    };

    try {
        const user = await models.User.findOne({
            attributes: [
                'id',
                'email',
                'name',
                'password',
                'isAdmin',
                'requestHash',
                'requestExpiry',
                'createdAt',
                'updatedAt'
            ],
            where: { requestHash: hash, email: email }
        })

        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        // if the link is expired, wipe the reset request
        if (new Date().getTime() > user.requestExpiry) {
            user.set({
                requestHash: null,
                requestExpiry: null
            });
    
            user.save();
            
            return res.status(401).json({ error: 'Expired request.' })
        }

        const duplicatePassword = await comparePasswords(password, user.password);

        if (duplicatePassword){
            return res.status(400).json({ error: 'Bad request' });
        }

        const hashedPassword = await hashPassword(password); 
        user.set({
            password: hashedPassword,
            requestHash: null,
            requestDate: null
        })

        user.save()

        const updateResponse = {
            userId: user.id,
            name: user.name,
            email: user.email,
            success: true
        }

        return res.status(200).json(updateResponse)

    } catch (err) {
        console.error(err)
        return res.status(500).json({ error: 'Server error.' })
    }
}