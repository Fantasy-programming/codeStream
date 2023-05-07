var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
require('dotenv').config();

//var config = require('../config');
//var transporter = nodemailer.createTransport(config.mailer);

const { body, validationResult } = require('express-validator');


// Auth

const createTransporter = async () => {
  const oauth2Client = new OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    "https://developers.google.com/oauthplayground"
  );

  oauth2Client.setCredentials({
    refresh_token: process.env.REFRESH_TOKEN
  });

  const accessToken = await new Promise((resolve, reject) => {
    oauth2Client.getAccessToken((err, token) => {
      if (err) {
        reject("Failed to create access token :(");
      }
      resolve(token);
    });
  });

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: process.env.EMAIL,
      accessToken,
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      refreshToken: process.env.REFRESH_TOKEN
    }
  });

  return transporter;
};

const sendEmail = async (emailOptions) => {
  let emailTransporter = await createTransporter();
  await emailTransporter.sendMail(emailOptions);
};



/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Codeshare, Pair programming platform' });
});

router.get("/about", function (req, res, next) {
  res.render('about', { title: 'Codeshare, pair programming platform' });
});

router.route("/contact")
  .get(function (req, res, next) {
    res.render('contact', { title: 'Codeshare, pair programming platform' });
  });

router.post('/contact', [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Invalid email address'),
  body('message').notEmpty().withMessage('Message is required'),
], function (req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render('contact', {
      title: 'Codeshare, pair programming platform',
      name: req.body.name,
      email: req.body.email,
      message: req.body.message,
      errorMessages: errors.array()
    });
  } else {

    sendEmail({
      subject: 'You got a new message from visitor 📬',
      text: req.body.message,
      to: 'cafemelon8@gmail.com',
      from: 'Codeshare <no-reply@codeshare.com>'
    });

    return res.render('thank', { title: 'Codeshare, pair programming platform' });

  }
});




module.exports = router;
