const nodemailer = require("nodemailer");

const sendEmail = async (email, subject, text) => { 
    try {
        const transporter = nodemailer.createTransport({
            host: 'mail.intolap.com',
            port: 465,
            secure: true,
            auth: {
                user: 'devtest@intolap.com',
                pass: 'r9$Py}h[Oq-5',
            },
        });

        const status = await transporter.sendMail({
            from: '"SPORTOJET" <devtest@intolap.com>',
            to: email,
            subject: subject,
            html: text
        });
        
        return true;
    } catch (error) {
        return false;
    }
};

module.exports = {sendEmail};