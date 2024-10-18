/*
    Functions for creating and sending email
 */
const nodemailer = require("nodemailer");
const dotenv = require('dotenv');
dotenv.config();

// set up nodemailer
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    }
});

// send a password reset email
exports.sendEmail = async(name, email, requestHash, requestExpiry) => {

    const formattedDate = requestExpiry.toLocaleDateString();
    const formattedTime = requestExpiry.toLocaleTimeString(); 
    try {
        // generate message
        const messageText = `Hello ${ name },\n
            You have requested a password reset for your Shelter Asset Tracker account. To enter your new password, please visit ${ process.env.APP_URL }/reset/${ requestHash }. This link will expire on ${ formattedDate } at ${ formattedTime }.\n
            This email account is not monitored. If you have questions, please contact your supervisor.`;

        // send mail with defined transport object
        const info = await transporter.sendMail({
            from: `"Shelter Asset Tracker" <${ process.env.EMAIL_USER }>`,
            to: email,
            subject: "Password Reset",
            text: messageText
        });

        return true;

    } catch(err) {
        console.error(err);
        return false;
    }
}