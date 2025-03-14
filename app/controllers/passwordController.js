const { models }  = require('../data');
const { hashPassword, createReset, comparePasswords, checkPassword } = require('../util/password');
const { sendEmail } = require('../util/mail');

// Initiates a password reset request by setting the necessary fields on the specified user
exports.createRequest = async (req, res, next) => {
    try {
        const user = req.data;
        const resetRequest = await createReset();

        user.set({
            requesthash: resetRequest.requestHash,
            requestexpiry: resetRequest.requestExpiry
        });

        const { name, email } = user;
        const { requestHash, requestExpiry } = resetRequest;
        if (!name || !email || !requestHash || !requestExpiry) {
            return res.status(400).json({ error: 'Bad request.' });
        };

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
                isAdmin: user.isadmin,
                created: user.createdat,
                success: true,
                emailSent: emailResponse
            };
            return res.status(201).json(response);
        };

        return res.status(200).json(response);

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server error.' });
    };
};

// Resends the password reset email if the user has a pending request
exports.resendRequest = async (req, res, next) => {
    const { email } = req.body;

    try {
        const user = await models.user.findOne({
            attributes: [
                'name',
                'requesthash',
                'requestexpiry',
            ],
            where: { email: email }
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        };

        const { name, requestHash, requestExpiry } = user;
        if (!requestHash || !requestExpiry){
            return res.status(404).json({ error: 'Request not found.' });
        };
    
        const emailResponse = await sendEmail(name, email, requestHash, requestExpiry);
    
        const response = {
            success: true,
            emailSent: emailResponse
        };
    
        return res.status(200).json(response);

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server error.' })
    };
};

// Sets a new password for a user who has a valid password request hash
exports.updatePassword = async (req, res, next) => {

    const hash = req.params.hash;
    const { email, password } = req.body;
    const validPassword = checkPassword(password);

    if ( !validPassword ) {
        return res.status(400).json({ error: 'Bad request.' });
    };

    try {
        const user = await models.user.findOne({
            attributes: [
                'id',
                'email',
                'name',
                'password',
                'isadmin',
                'requesthash',
                'requestexpiry',
                'createdat',
                'updatedat'
            ],
            where: { requesthash: hash, email: email }
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        };

        // if the link is expired, wipe the reset request
        if (new Date().getTime() > user.requestexpiry) {
            user.set({
                requesthash: null,
                requestexpiry: null
            });
    
            user.save();
            
            return res.status(401).json({ error: 'Expired request.' });
        };

        if (user.password){
            const duplicatePassword = await comparePasswords(password, user.password);

            if (duplicatePassword){
                return res.status(400).json({ error: 'Bad request' });
            };
        };

        const hashedPassword = await hashPassword(password); 
        user.set({
            password: hashedPassword,
            requesthash: null,
            requesthxpiry: null
        });

        user.save();

        const updateResponse = {
            userId: user.id,
            name: user.name,
            email: user.email,
            success: true
        };

        return res.status(200).json(updateResponse);

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server error.' });
    };
};