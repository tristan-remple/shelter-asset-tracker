const { models } = require('../data')
const { hashPassword } = require('../util/hash')
const { verifyToken } = require('../util/token')

const nodemailer = require("nodemailer")
var randomstring = require("randomstring")
const { DataTypes } = require('sequelize')
const dotenv = require('dotenv')

dotenv.config()

// set the length of time that password resets should be available, in days
const expireInDays = 7
const offset = expireInDays * 86400000

// set up nodemailer
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
})

// send a password reset email
async function sendEmail(user) {

    const { name, email, requestHash, requestDate } = user
    if (!name || !email || !requestHash || !requestDate) {
        return {
            success: false,
            messsage: "User lacks required fields."
        }
    }

    // generate message
    const expiryDate = new Date(requestDate.getTime() + offset)
    const formattedDate = expiryDate.toString()
    const messageText = `Hello ${ name },\n
        You have requested a password reset for your Shelter Asset Tracker account. To enter your new password, please visit ${ process.env.APP_URL }/reset/${ requestHash }. This link will expire on ${ formattedDate }.\n
        This email account is not monitored. If you have questions, please contact your supervisor.`

    try {
        // send mail with defined transport object
        const info = await transporter.sendMail({
            from: `"Shelter Asset Tracker" <${ process.env.EMAIL_USER }>`,
            to: email,
            subject: "Password Reset",
            text: messageText
        })

        return {
            success: true,
            message: info.messageId
        }

    } catch(err) {
        return {
            success: false,
            message: err
        }
    }
}

// set password reset request fields on the current user
exports.createRequest = async (req, res, next) => {
    try {
        const user = req.data

        const hash = randomstring.generate()

        user.set({
            requestHash: hash,
            requestDate: new Date()
        })

        await user.save()

        const emailResponse = await sendEmail(user)
        console.log(emailResponse)

        return res.status(200).json(emailResponse);

    } catch (err) {
        console.error(err)
        return res.status(500).json({ error: 'Server error.' })
    }
}

exports.updatePassword = async (req, res, next) => {

    const { hash, email, password } = req.body

    try {
        const user = await models.User.findOne({
            attributes: [
                'id',
                'email',
                'name',
                'isAdmin',
                'createdAt',
                'updatedAt'
            ],
            where: { requestHash: hash, email: email }
        })

        if (!user) {
            return res.status(404).json({ error: 'User not found.' })
        }

        const expiryDate = user.requestDate.getTime() + offset
        if (new Date().getTime() > expiryDate) {

            user.set({
                requestHash: null,
                requestDate: null
            })
    
            user.save()
            
            return res.status(401).json({ error: 'Expired.' })
        }

        const hashedPassword = await hashPassword(password)
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