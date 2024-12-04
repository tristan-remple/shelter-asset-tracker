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
            This email is being sent to you so that you can set your password for your Shelter Asset Tracker account, either because your account is new or because you need to reset your password.\n
            To enter your new password, please visit ${ process.env.EMAIL_URL }/reset/${ requestHash }. This link will expire on ${ formattedDate } at ${ formattedTime }.\n
            This email account is not monitored. If you have questions, please contact your supervisor.\n\n
            
            If you are not sure why you're getting this email, please disregard it.`;

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