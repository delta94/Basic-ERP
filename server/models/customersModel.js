const mongoose = require('mongoose');
const validator = require('validator');
const shortid = require('shortid');

const isPhoneValidator = /^(?:\+?([0-90-9]))? ?(?:\((?=.*\)))?(0?[0-90-9])\)? ?(\d\d(?:[- ](?=\d{3})|(?!\d\d[- ]?\d[- ]))\d\d[- ]?\d[- ]?\d{3})$/;

const customerSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: shortid.generate
  },
  name: {
    type: String,
    required: [true, 'Name cannot be empty !'],
    text: true
  },
  address: {
    type: String,
    required: [true, 'Address cannot be empty !']
  },
  phone: {
    type: String,
    required: [true, 'Phone cannot be empty !'],
    validate: [isPhoneValidator, 'Phone number is in wrong format !!']
  },
  email: {
    type: String
  }
});

const Customer = mongoose.model('Customer', customerSchema);

module.exports = Customer;
