const mongoose = require('mongoose');
const Finance = require('../models/financesModel');
const factory = require('./apifactory/controllerFactory');
const catchAsync = require('../utils/catchAsync');
const Order = require('../models/ordersModel');
const Stocking = require('../models/stockingModel');

exports.createFinancialPeriod = factory.createOne(Finance);
exports.updateFinancialPeriod = factory.updateOne(Finance);
exports.deleteFinancialPeriod = factory.deleteOne(Finance);
exports.getFinancialPeriod = factory.getOne(Finance);
exports.getAllFinancialPeriods = factory.getAll(Finance);

exports.attachFinanceRef = catchAsync(async (req, res, next) => {
  // use the latest period
  let financePeriod = await Finance.findOne().sort({ $natural: -1 }).limit(1);
  if (!financePeriod) {
    financePeriod = await Finance.create({});
  }

  req.body.finance_ref = financePeriod._id;
  next();
});

/**
 * This middleware gathers all dependencies such as Orders and Stockings
 *  that would be used for financial period.
 *
 * Because period contains Orders and Stockings we must gather for calculation
 *  and storing for future fetch.
 *
 * Please use this controller after any actions or routes called
 */
exports.gatherDependencies = catchAsync(async (req, res, next) => {
  const session = await mongoose.startSession();

  await session.withTransaction(async () => {
    // use the latest period
    const financePeriod = await Finance.findOne()
      .sort({ $natural: -1 })
      .limit(1)
      .session(session);

    // fetch all orders having finance_ref
    const ordersWithRef = await Order.find({
      finance_ref: financePeriod._id
    }).session(session);
    financePeriod.orders = ordersWithRef.map((el) => el._id);

    // fetch all stockings having finance_ref
    const stockingsWithRef = await Stocking.find({
      finance_ref: financePeriod._id
    }).session(session);
    financePeriod.stockings = stockingsWithRef.map((el) => el._id);

    // Save
    await financePeriod.save();
  });

  next();
});

exports.getLatestFinancialPeriod = catchAsync(async (req, res, next) => {
  // use the latest period
  const financePeriod = await Finance.findOne().sort({ $natural: -1 }).limit(1);

  res.status(200).json({
    status: 'success',
    data: {
      data: financePeriod
    }
  });
});

/**
 * Middleware for closing Financial Period, the next middleware should be
 *  opening a new period, please don't use this middleware alone
 */
exports.closeFinancialPeriod = catchAsync(async (req, res, next) => {
  // use the latest period
  const financePeriod = await Finance.findOne().sort({ $natural: -1 }).limit(1);

  financePeriod.timestamp.end = Date.now();

  await financePeriod.save();

  next();
});
