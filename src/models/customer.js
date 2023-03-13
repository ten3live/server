const Joi = require("joi");
const mongoose = require("mongoose");

const Customer = mongoose.model(
  "Customer",
  new mongoose.Schema({
    name: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 50,
    },
    email: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 500,
    },
    comment: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 500,
    },
    mobile: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 50,
    },
    date: {
      type: Date,

      default: Date.now,
    },
  })
);

function validateCustomer(customer) {
  const schema = {
    name: Joi.string().min(5).max(50).required(),
    email: Joi.string().min(5).max(50).required(),
    comment: Joi.string().min(5).max(500).required(),
    mobile: Joi.string().min(5).max(50).required(),
  };

  return Joi.validate(customer, schema);
}

exports.Customer = Customer;
exports.validate = validateCustomer;
