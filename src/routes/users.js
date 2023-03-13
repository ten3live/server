const express = require('express');
const auth = require('../middleware/auth');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcrypt');
const {ImageFile, User, validate} = require('../models/user');
const mongoose = require('mongoose');
const router = express.Router();

const getUsers = async (req, res, next) => {
  try {
    const result = await User.find().select('-password');
    res.status(200);
    const response = {
      viewImages: result.map(res => {
        return {
          ImageLink: `http://10.0.2.2:3000/${res.image.split('\\')[2]}`,
          name: res.name,
          email: res.email,
          mobile: res.mobile,
          address: res.address,
          _id: res._id,
          isActive: res.isActive,
          isAdmin: res.isAdmin,
        };
      }),
    };
    res.send(response);
  } catch (error) {
    console.log(error);
  }
};

router.route('/download').get(getUsers);

router.get('/me', auth, async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  res.send(user);
});

const storage = multer.diskStorage({
  destination: './public/uploads/',
  filename: function (req, file, cb) {
    cb(null, file.fieldname + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: function (req, file, cb) {
    if (
      file.mimetype === 'image/png' ||
      file.mimetype === 'image/jpg' ||
      file.mimetype === 'image/PNG' ||
      file.mimetype === 'image/JPG' ||
      file.mimetype === 'image/JPEG' ||
      file.mimetype === 'image/jpeg'
    ) {
      cb(null, true);
    } else {
      console.log('Something Went Wrong');
    }
  },
});

router.post('/', upload.single('image'), async (req, res) => {
  const {error} = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({email: req.body.email});
  if (user) {
    fs.unlink(req.file.path, err => {
      if (err) console.error(err);
      console.log('Image file was deleted');
    });
    return res.status(400).send('User already registered.');
  }

  user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    image: req.file.path,
    mobile: req.body.mobile,
    address: req.body.address,
  });
  user.save(error => {
    if (error) {
      return res.status(500).json({error});
    }
  });
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();

  const token = user.generateAuthToken();
  res.header('x-auth-token', token).send({
    name: user.name,
    email: user.email,
    image: user.image,
    mobile: user.mobile,
    address: user.address,
  });
});
router.put('/:id', upload.single('image'), async (req, res) => {
  const {error} = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      image: req.file.path,
      mobile: req.body.mobile,
      address: req.body.address,
    },
    {new: true},
  );

  if (!user)
    return res.status(404).send('The user with the given ID was not found.');

  res.send(user);
});

module.exports = router;
