const Joi = require("joi");
const mongoose = require("mongoose");

const Payment = mongoose.model(
  "Payment",
  new mongoose.Schema({
    paymentId: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 50,
    },
    itemNumber: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 50,
    },
    txnId: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 50,
    },
    PaymentGross: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 50,
    },
    CurrencyCode: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 50,
    },
    PaymentStatus: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 50,
    },
    dateOut: {
      type: Date,
      required: true,
      default: Date.now,
    },
    dateReturned: {
      type: Date,
    },
  })
);

function validatePayment(payment) {
  const schema = {
    paymentId: Joi.string().min(5).max(50).required(),
    itemNumber: Joi.string().min(5).max(50).required(),
    txnId: Joi.string().min(5).max(50).required(),
    PaymentGross: Joi.string().min(5).max(50).required(),
    CurrencyCode: Joi.string().min(5).max(50).required(),
    PaymentStatus: Joi.string().min(5).max(50).required(),
  };

  return Joi.validate(payment, schema);
}

exports.Payment = Payment;
exports.validate = validatePayment;
