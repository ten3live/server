const Joi = require("joi");
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const { User } = require("../models/user");
const mongoose = require("mongoose");
const express = require("express");
const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
const router = express.Router();



router.post('/reset-password', async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  const resetToken = (Math.floor(Math.random() * 99) + 10).toString()
  user.resetToken = resetToken;
  await user.save();

  const transporter = nodemailer.createTransport(
    smtpTransport({
      host: 'sg2plzcpnl489587.prod.sin2.secureserver.net', // GoDaddy's SMTP server hostname
        auth: {
        user: 'ten3live@hunzaexports.com',
        pass: 'sajjadali7'
      },
    })
    // service: 'sg2plzcpnl489587.prod.sin2.secureserver.net',//gmail
    //  auth: {
    //   user: 'ten3live@hunzaexports.com',
    //   pass: 'sajjadali7'
    // }
  );

  const mailOptions = {
    from: 'ten3live@hunzaexports.com',
    to: email,
    subject: 'Password Reset',
    html: `
      <p>Please click the following link to reset your password:</p>
      <p>${resetToken}</p>
     

    `
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ message: 'Failed to send email' });
    } else {
      console.log('Email sent: ' + info.response);
      return res.json({ message: 'Email sent' });
    }
  });
});




router.post('/reset-password/:resetToken', async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }
  try {
    const { resetToken } = req.params;
    const { password } = req.body;
    const user = await User.findOne({ resetToken: resetToken });
    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
       await user.save();
    res.json({ message: 'Password reset successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});



router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Invalid email or password.");

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send("Invalid email or password.");

  const token = user.generateAuthToken();
  res.send(token);
});

function validate(req) {
  const schema = {
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required(),
  };

  return Joi.validate(req, schema);
}

module.exports = router;
