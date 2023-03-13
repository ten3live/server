//Import Packages
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const config = require('config');
const Joi = require('joi');
//Import Routes
Joi.objectId = require('joi-objectid')(Joi);
const categories = require('./routes/categories');
const customers = require('./routes/customers');
const products = require('./routes/products');
const nodemailer = require('./routes/nodemailer');
const orders = require('./routes/orders');
const posts= require('./routes/posts');
const payments = require('./routes/payments');
const users = require('./routes/users');
const auth = require('./routes/auth');

//Use Packages
const app = express();
app.use(bodyParser.json());
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({extended: true}));
app.use(express.static('./public/uploads'));

//Connections
if (!config.get('jwtPrivateKey')) {
  console.error('FATAL ERROR: jwtPrivateKey is not defined.');
  process.exit(1);
}
mongoose
  .connect("mongodb://localhost/vidly")
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.error("Could not connect to MongoDB..."));

//Use Routes
app.use('/api/categories', categories);
app.use('/api/customers', customers);
app.use('/api/products', products);
app.use('/api/orders', orders);
app.use('/api/payments', payments);
app.use('/api/posts', posts);
app.use('/api/users', users);
app.use('/api/email', nodemailer);
app.use('/api/auth', auth);

//App Port
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
