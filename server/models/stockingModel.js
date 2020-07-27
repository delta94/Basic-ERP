const mongoose = require('mongoose');
const nuid = require('number-uid');

const uid7 = () => `NH${nuid(2)}${nuid(7)}`;
/**
 * This model used when stocking or create stock.
 *  That means, when we receive a stock from US or AUS
 *  we will use this model to represent the transaction.
 *  All the history will be saved here also
 */
const stockingSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: uid7
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  products: {
    type: [
      {
        _id: {
          type: String,
          ref: 'Product',
          autopopulate: true
        },
        import_qty: {
          type: Number,
          min: [0, 'Số lượng phải lớn hơn 0']
        },
        total: Number
      }
    ],
    required: [true, 'Nhập hàng phải có sản phẩm'],
    validate: {
      validator(el) {
        return el.length > 0;
      },
      message: 'Nhập hàng phải có ít nhất một sản phẩm'
    }
  },
  total: {
    type: Number,
    required: [true, 'Nhập hàng phải có tổng tiền']
  },
  description: {
    type: String,
    default: ''
  },
  finance_ref: {
    type: String,
    ref: 'Finance'
  }
});

// Plugin
stockingSchema.plugin(require('mongoose-autopopulate'));

const Stocking = mongoose.model('Stocking', stockingSchema);

module.exports = Stocking;
