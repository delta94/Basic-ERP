const mongoose = require('mongoose');
const validator = require('validator');
const shortid = require('shortid');
const AppError = require('../utils/appError');

const productSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: shortid.generate
  },
  url: {
    type: String,
    validate: validator.default.isURL
  },
  stock: {
    type: Number,
    default: 0,
    min: 0
  },
  name: {
    type: String,
    required: [true, 'Tên sản phẩm không thể bỏ trống !']
  },
  provider: {
    type: String
  },
  image: {
    type: String,
    validate: validator.default.isURL
  },
  discounted_price: {
    type: Number,
    required: [true, 'Giá giảm không thể bỏ trống !']
  },
  retail_price: {
    type: Number,
    required: [true, 'Giá gốc không thể bỏ trống !']
  },
  sell_price_vnd: {
    type: Number,
    required: [true, 'Giá bán không thể bỏ trống !']
  }
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
