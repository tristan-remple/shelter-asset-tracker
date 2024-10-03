const { models } = require('../data');
const { hashPassword, createReset } = require('../util/password');
const { sendEmail } = require('../util/email');

// set password reset request fields on the current user
exports.createRequest = async (req, res, next) => {
    try {
        const user = req.data;
        const resetRequest = createReset;

        user.set(resetRequest);
        const { name, email, requestHash, requestExpiry } = user;
        if (!name || !email || !requestHash || !requestExpiry) {
            return res.status(400).json({ error: 'Bad request.' });
        }

        const emailResponse = await sendEmail(user);
        console.log(emailResponse);

        if (!emailResponse.success) {
            return res.status(500).json('Email failed to send.');
        }

        await user.save();
        return res.status(200).json(emailResponse);

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server error.' });
    }
}

// set a new password for a user with a valid password request hash
exports.updatePassword = async (req, res, next) => {

    const hash = req.params.hash;
    const { email, password } = req.body;
    const validPassword = checkPassword(password);

    if ( !email || !validPassword ) {
        return res.status(400).json({ error: 'Bad request' });
    };

    try {
        const user = await models.User.findOne({
            attributes: [
                'id',
                'email',
                'name',
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