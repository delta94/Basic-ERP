const mongoose = require('mongoose');
const nuid = require('number-uid');
const AppError = require('../utils/appError');

const uid7 = () => `DH${nuid(2)}${nuid(5)}`;
const uid10 = () => nuid(10);

const orderSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: uid7
    },
    status: {
      type: String,
      enum: ['pending', 'fulfilled', 'ausvnshipped', 'vnchecked', 'completed'],
      default: 'pending'
    },
    customer: {
      type: String,
      ref: 'Customer',
      required: [true, 'Đơn hàng phải có thông tin khách'],
      autopopulate: true
    },
    timestamp: {
      created: {
        type: Date,
        default: Date.now
      },
      ausvnshipped: Date,
      vnchecked: Date,
      completed: Date
    },
    payments: {
      type: [
        {
          _id: {
            type: String,
            default: uid10
          },
          payment_type: {
            type: String,
            enum: ['cash', 'card'],
            required: [true, 'Xin nhập phương thức thanh toán']
          },
          timestamp: {
            type: Date,
            default: Date.now()
          },
          total: {
            type: Number,
            required: [true, 'Xin nhập số tiền thanh toán']
          }
        }
      ],
      validate: {
        async validator(value) {
          if (this instanceof mongoose.Query) {
            const doc = await this.model.findOne();

            return doc.payment_due - value[0].total > 0;
          }
          return true;
        },
        message: 'Tiền thanh toán không lớn hơn giá trị đơn'
      }
    },
    shipments: {
      type: [
        {
          _id: {
            type: String,
            default: uid10
          },
          timestamp: {
            type: Date,
            default: Date.now()
          },
          description: String,
          total: Number,
          products: {
            type: [
              {
                _id: {
                  type: String,
                  ref: 'Product',
                  autopopulate: true
                },
                ship_qty: {
                  type: Number,
                  min: [1, 'Số lượng phải lớn hơn 0']
                },
                total: Number
              }
            ]
          }
        }
      ]
    },
    products: {
      type: [
        {
          _id: {
            type: String,
            ref: 'Product',
            autopopulate: true
          },
          quantity: {
            type: Number,
            min: [1, 'Số lượng phải lớn hơn 0']
          },
          shipped: {
            type: Number,
            default: 0
          },
          payed: {
            type: Number,
            default: 0
          },
          total: Number
        }
      ],
      required: [true, 'Đơn hàng phải có sản phẩm'],
      validate: {
        validator(el) {
          return el.length > 0;
        },
        message: 'Đơn hàng phải có ít nhất một sản phẩm'
      }
    },
    total: {
      type: Number,
      required: [true, 'Đơn hàng phải có tổng tiền']
    },
    description: {
      type: String,
      default: ''
    },
    finance_ref: {
      type: String,
      ref: 'Finance'
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

// Plugin
orderSchema.plugin(require('mongoose-autopopulate'));

/**
 * Validate the relationship between  Quantity & Shipped in products
 */
orderSchema.pre('validate', function (next) {
  // self validation
  this.products.forEach((el) => {
    if (el.shipped > el.quantity) {
      next(new AppError('Hàng đã ship không thể lớn hơn đã đặt', 400));
    } else if (el.payed > el.quantity)
      next(new AppError('Hàng đã thu tiền không thể lớn hơn đã đặt', 400));
  });

  next();
});

orderSchema.virtual('payment_due').get(function () {
  // Calculate the upToDatePayment
  const upToDatePayment = this.payments.reduce(
    (prev, curr) => prev + curr.total,
    0
  );

  return this.total - upToDatePayment;
});

/**
 * Always check if this order is Completed
 */
orderSchema.post(/^findOneAnd|^findOne|update|save/g, async function (
  order,
  next
) {
  /**
   * Loop through each Products and check if it all are shipped
   */
  let completedProductCount = 0;
  console.log(order);
  order.products.forEach((el) => {
    if (el.shipped === el.quantity) completedProductCount++;
  });

  /**
   * Check if this order has shipped all products and payed all amount
   *  and the status not yet changed
   */
  if (
    completedProductCount === order.products.length &&
    order.payment_due === 0 &&
    order.status !== 'completed'
  ) {
    order.status = 'completed';
    order.timestamp.completed = Date.now();
    await order.save();
  }

  next();
});

orderSchema.post('update', function (error, res, next) {
  console.log('hello');
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
