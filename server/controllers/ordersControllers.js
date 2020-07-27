const mongoose = require('mongoose');
const Order = require('../models/ordersModel');
const Product = require('../models/productsModel');
const factory = require('./apifactory/controllerFactory');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.createOrder = factory.createOne(Order);
exports.updateOrder = factory.updateOne(Order);
exports.deleteOrder = factory.deleteOne(Order);
exports.getOrder = factory.getOne(Order);
exports.getAllOrders = factory.getAll(Order);

/**
 * Req.body {
 *  product_id: '',
 *  ship_qty: Number
 * }
 */
// exports.shipSingleItem = catchAsync(async (req, res, next) => {
//   const order_id = req.params.id;
//   const { product_id, ship_qty } = req.body;
//   // Start a transaction, that on error, we abort and roll back
//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//     // Update the stock of product
//     await Product.findByIdAndUpdate(
//       product_id,
//       {
//         // Decrease the stock
//         $inc: { stock: -ship_qty }
//       },
//       {
//         upsert: true,
//         new: true
//       }
//     ).session(session);

//     // find order
//     const order = await Order.findById(order_id).session(session);

//     // update shipments
//     order.products.forEach((el) => {
//       if (String(el._id._id) === product_id) {
//         el.shipped += ship_qty;
//       }
//     });

//     await order.save({ validateBeforeSave: true });

//     // commit transaction
//     await session.commitTransaction();

//     res.status(200).json({
//       status: 'success',
//       data: {
//         data: order
//       }
//     });
//   } catch (e) {
//     await session.abortTransaction();
//     next(new AppError(e.message, 500));
//   } finally {
//     await session.endSession();
//   }
// });

exports.shipMultipleItems = catchAsync(async (req, res, next) => {
  const order_id = req.params.id;

  /**
   * Product element should have format as
   * {
   *    product_id,
   *    ship_qty,
   *    total
   * }
   */
  const { products } = req.body;

  // Start a transaction, that on error, we abort and roll back
  const session = await mongoose.startSession();

  let data = null;
  await session.withTransaction(() =>
    Promise.all([
      // Update stock
      ...products.map(async (el) => {
        const product = await Product.findById(el._id).session(session);
        product.stock -= el.ship_qty;

        await product.save();
      }),
      // Push to order this shipments
      (async () => {
        data = await Order.findById(order_id).session(session);

        // Increase the shipped
        products.forEach((product) => {
          for (let i = 0; i < data.products.length; i++) {
            const el = data.products[i];
            if (String(el._id._id) === product._id) {
              el.shipped += product.ship_qty;
            }
          }
        });

        // push order
        data.shipments.push(req.body);

        await data.save();
      })()
    ])
  );

  res.status(200).json({
    status: 'success',
    data: {
      data
    }
  });
});

exports.createPayment = catchAsync(async (req, res, next) => {
  const order_id = req.params.id;
  const data = await Order.findById(order_id);

  data.payments.push(req.body);

  await data.save();

  res.status(200).json({
    status: 'success',
    data: {
      data
    }
  });
});
