const Joi = require("joi");
const mongoose = require("mongoose");

const Order = mongoose.model(
  "Order",
  new mongoose.Schema({
    user: {
      type: new mongoose.Schema({
        name: {
          type: String,

          minlength: 5,
          maxlength: 50,
        },
        address: {
          type: String,

          minlength: 5,
          maxlength: 500,
        },
        isActive: {
          type: Boolean,
          default: false,
        },
        mobile: {
          type: String,

          minlength: 5,
          maxlength: 50,
        },
      }),
    },
    product: {
      type: new mongoose.Schema({
        name: {
          type: String,

          trim: true,
          minlength: 5,
          maxlength: 255,
        },
        price: {
          type: Number,
          min: 0,
          max: 5000,
        },
      }),
    },
    dateOut: {
      type: Date,

      default: Date.now,
    },
    dateReturned: {
      type: Date,
    },
    orderFee: {
      type: Number,
      min: 0,
    },
  })
);

function validateOrder(order) {
  const schema = {
    userId: Joi.objectId().required(),
    productId: Joi.objectId().required(),
  };

  return Joi.validate(order, schema);
}

exports.Order = Order;
exports.validate = validateOrder;
