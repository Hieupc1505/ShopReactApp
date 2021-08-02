require("dotenv").config();

const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const { OAuth2 } = google.auth;
const createError = require("http-errors");
const MAIL_OAUTHPAYGROUND = "https://developers.google.com/oauthplayground/";

const { CLIENT_ID, CLIENT_SECRET, REFRESHTOKEN_MAIL, MAIL_FROM } = process.env;

const oauth2Client = new OAuth2({
    CLIENT_ID,
    CLIENT_SECRET,
    REFRESHTOKEN_MAIL,
    MAIL_OAUTHPAYGROUND,
});

const sendMail = (to, url, text = "") => {
    oauth2Client.setCredentials({
        refresh_token: REFRESHTOKEN_MAIL,
    });
    try {
        const accessToken = oauth2Client.getAccessToken(); //
        const smtpTransport = nodemailer.createTransport({
            service: "gmail", //
            auth: {
                type: "OAuth2", //
                user: MAIL_FROM,
                clientId: CLIENT_ID, //
                clientSecret: CLIENT_SECRET, //
                refreshToken: REFRESHTOKEN_MAIL,
                accessToken,
            },
        });

        const mailOptions = {
            from: MAIL_FROM,
            to,
            subject: "Shop Full Send To You",
            html: `
                <div style="max-width: 700px; margin:auto; border: 10px solid #ddd; padding: 50px 20px; font-size: 110%;">
                <h2 style="text-align: center; text-transform: uppercase;color: teal;">Welcome to the GDShop!!.</h2>
                <p>Congratulations! You're almost set to start using DEVAT✮SHOP.
                    Just click the button below to ${text}.
                </p>
                
                <a href=${url} style="background: crimson; text-decoration: none; color: white; padding: 10px 20px; margin: 10px 0; display: inline-block;">Activate your Email</a>
            
                <p>If the button doesn't work for any reason, you can also click on the link below:</p>
            
                <div>${url}</div>
                </div>
                `,
        };

        smtpTransport.sendMail(mailOptions, (err, infor) => {
            if (err) {
                return err;
            }
            return infor;
        });
        // const result = await smtpTransport.sendMail(mailOptions);
        // return result;
    } catch (err) {
        console.log(err);
    }
};

module.exports = sendMail;
