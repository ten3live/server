const { Payment, validate } = require("../models/payment");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  const payments = await Payment.find().sort("-dateOut");
  res.send(payments);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  let payment = new Payment({
    paymentId: req.body.paymentId,
    itemNumber: req.body.itemNumber,
    txnId: req.body.txnId,
    PaymentGross: req.body.PaymentGross,
    CurrencyCode: req.body.CurrencyCode,
    PaymentStatus: req.body.PaymentStatus,
  });
  payment = await payment.save();

  res.send({
    paymentId: payment.paymentId,
    itemNumber: payment.itemNumber,
    txnId: payment.txnId,
    PaymentGross: payment.PaymentGross,
    PaymentStatus: payment.PaymentStatus,
    CurrencyCode: payment.CurrencyCode,
  });
});

router.get("/:id", async (req, res) => {
  const payment = await Payment.findById(req.params.id);

  if (!payment)
    return res.status(404).send("The payment with the given ID was not found.");

  res.send(payment);
});

module.exports = router;
