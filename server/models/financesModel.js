const mongoose = require('mongoose');
const nuid = require('number-uid');

const uid7 = () => `FN${nuid(2)}${nuid(5)}`;

const financeSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: uid7
    },
    orders: [
      {
        type: String,
        ref: 'Order',
        autopopulate: true
      }
    ],
    stockings: [
      {
        type: String,
        ref: 'Stocking',
        autopopulate: true
      }
    ],
    expenses: [
      {
        total: Number,
        description: String,
        payment_type: {
          type: String,
          enum: ['cash', 'card'],
          required: [true, 'Xin nhập phương thức thanh toán']
        },
        currency: {
          type: String,
          enum: ['VND', 'AUD'],
          required: [true, 'Xin nhập loại tiền tệ']
        }
      }
    ],
    timestamp: {
      start: {
        type: Date,
        default: Date.now()
      },
      end: Date
    }
  },
  {
    toJSON: {
      virtuals: true
    },
    toObject: {
      virtuals: true
    }
  }
);

financeSchema.plugin(require('mongoose-autopopulate'));

/**
 * Generate Current revenues, which is calculated by the amount
 *  that customers already paid
 */
financeSchema.virtual('revenues_curr_vnd').get(function () {
  const revenues_curr = this.orders.reduce(
    (prev, curr) => prev + (curr.total - curr.payment_due),
    0
  );
  return revenues_curr;
});

/**
 * Generate final revenues that expects customers have paid
 *  all orders
 */
financeSchema.virtual('revenues_after_vnd').get(function () {
  const revenues_after = this.orders.reduce(
    (prev, curr) => prev + curr.total,
    0
  );
  return revenues_after;
});

/**
 * Calculate the funds has been used by calculating
 *  stocking amount & expenses
 */
financeSchema.virtual('funds_aud').get(function () {
  const funds_stockings = this.stockings.reduce(
    (prev, curr) => prev + curr.total,
    0
  );

  const funds_expenses = this.expenses.reduce(
    (prev, curr) => prev + curr.total,
    0
  );

  return funds_stockings + funds_expenses;
});

const Finance = mongoose.model('Finance', financeSchema);

module.exports = Finance;
