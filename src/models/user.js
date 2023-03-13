const config = require("config");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 100,
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1005,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 10024,
  },
  image: {
    type: String,
  },
  resetToken: {
    type: String,
  },
  mobile: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 100,
  },
  address: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1000,
  },
  isActive: {
    type: Boolean,
    default: false,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { _id: this._id, isAdmin: this.isAdmin },
    config.get("jwtPrivateKey")
  );
  return token;
};

const User = mongoose.model("User", userSchema);

function validateUser(user) {
  const schema = {
    name: Joi.string().min(5).max(100).required(),
    email: Joi.string().min(5).max(2550).required().email(),
    password: Joi.string().min(5).max(2550).required(),
    image: Joi.string(),
    resetToken: Joi.string(),
    mobile: Joi.string().min(5).max(130).required(),
    address: Joi.string().min(5).max(5000).required(),
  };

  return Joi.validate(user, schema);
}

exports.User = User;
exports.userSchema = userSchema;
exports.validate = validateUser;
