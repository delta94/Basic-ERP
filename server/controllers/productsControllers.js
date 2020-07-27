const Product = require('../models/productsModel');
const Order = require('../models/ordersModel');
const Customer = require('../models/customersModel');
const factory = require('./apifactory/controllerFactory');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.createProduct = factory.createOne(Product);
exports.updateProduct = factory.updateOne(Product);
exports.deleteProduct = factory.deleteOne(Product);
exports.getProduct = factory.getOne(Product);
exports.getAllProducts = factory.getAll(Product);

exports.getToBuyProducts = catchAsync(async (req, res, next) => {
  const aggregate = await Order.aggregate([
    {
      // Find all orders that are pending
      $match: {
        status: 'pending'
      }
    },
    {
      // Destructuring the Array Element into separate Object
      $unwind: '$products'
    },
    // {
    //   //Only select field "products" and deselect _id
    //   $project: {products: 1, _id: 0}
    // },
    {
      // Group item based on "products._id"
      $group: {
        _id: '$products._id',
        tobuy: { /* Each product, we increase 1 */ $sum: '$products.quantity' },
        customers: {
          $push: {
            _id: '$customer',
            quantity: '$products.quantity'
          }
        }
      }
    }
  ]).exec(async (err, results) => {
    // Populate the product name based on _id
    results = await Product.populate(results, { path: '_id' });

    // Loop through each element in the results and populate Customer name based on _id
    await Promise.all(
      // Turn each Element into a Promise that execute
      results.map((el) =>
        (async () => {
          // Populate for each element
          el = await Customer.populate(el.customers, { path: '_id' });
        })()
      )
    );

    // Send back response
    res.status(200).json({
      status: 'success',
      data: {
        data: results
      }
    });
  });
});
