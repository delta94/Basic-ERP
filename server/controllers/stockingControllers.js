const mongoose = require('mongoose');
const Stocking = require('../models/stockingModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Product = require('../models/productsModel');
const factory = require('./apifactory/controllerFactory');

exports.getStockRecord = factory.getOne(Stocking);
exports.getStockingHistory = factory.getAll(Stocking);

exports.importStock = catchAsync(async (req, res, next) => {
  console.log(req.body);
  // Start a transaction, that on error, we abort and roll back
  const session = await mongoose.startSession();

  try {
    let data = null;

    // Subsequent transaction action with automation
    await session.withTransaction(() =>
      Promise.all([
        ...req.body.products.map(async (el) => {
          await Product.findByIdAndUpdate(
            el._id,
            {
              $inc: { stock: el.import_qty }
            },
            {
              upsert: true,
              new: true
            }
          ).session(session);
        }),
        (async () => {
          data = await Stocking.create(
            [
              {
                products: req.body.products,
                total: req.body.total,
                finance_ref: req.body.finance_ref
              }
            ],
            { session }
          );
        })()
      ])
    );

    res.status(200).json({
      status: 'success',
      data: {
        data
      }
    });
  } catch (e) {
    if (process.env.NODE_ENV === 'development') console.log(e);
    next(new AppError(e.message, 500));
  } finally {
    await session.endSession();
    next();
  }
});
