const Joi = require('joi');
const mongoose = require('mongoose');
const {categorySchema} = require('./category');
const {userSchema} = require('./user');

const Product = mongoose.model(
  'products',
  new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    price: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    description: {
      type: String,
      required: true,
    },
    date: {
      type: Date,

      default: Date.now,
    },
    
  }),
);

function validateProduct(product) {
  const schema = {
    name: Joi.string().required(),
    price: Joi.string().required(),
    image: Joi.string(),
    description: Joi.string().required(),
    };

  return Joi.validate(product, schema);
}

exports.Product = Product;
exports.validate = validateProduct;
