const config = require("config");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const mongoose = require("mongoose");
const categories = require("./routes/categories");
const customers = require("./routes/customers");
const products = require("./routes/products");
const orders = require("./routes/orders");
const payments = require("./routes/payments");
const users = require("./routes/users");
const auth = require("./routes/auth");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./public/uploads"));

if (!config.get("jwtPrivateKey")) {
  console.error("FATAL ERROR: jwtPrivateKey is not defined.");
  process.exit(1);
}

mongoose
  .connect("mongodb://localhost/vidly")
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.error("Could not connect to MongoDB..."));

app.use("/api/categories", categories);
app.use("/api/customers", customers);
app.use("/api/products", products);
app.use("/api/orders", orders);
app.use("/api/payments", payments);
app.use("/api/users", users);
app.use("/api/auth", auth);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
