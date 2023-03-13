const { Order, validate } = require("../models/order");
const { Product } = require("../models/product");
const { User } = require("../models/user");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  const orders = await Order.find().sort("-dateOut");
  res.send(orders);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findById(req.body.userId);
  if (!user) return res.status(400).send("Invalid user.");

  const product = await Product.findById(req.body.productId);
  if (!product) return res.status(400).send("Invalid product.");

  if (product.stock === 0) return res.status(400).send("Product not in stock.");

  let order = new Order({
    user: {
      _id: user._id,
      name: user.name,
      mobile: user.mobile,
      address: user.address,
    },
    product: {
      _id: product._id,
      name: product.name,
      price: product.price,
    },
  });

  try {
    order = await order.save();
    await Product.updateOne({ _id: product._id }, { $inc: { stock: -1 } });

    res.send(order);
  } catch (ex) {
    res.status(500).send("Something failed." + ex);
  }
});

router.get("/:id", async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order)
    return res.status(404).send("The order with the given ID was not found.");

  res.send(order);
});

module.exports = router;
