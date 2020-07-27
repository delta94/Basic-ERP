const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/appError');
const APIFeatures = require('./getAPIFeatures');

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new AppError('No document found with that ID', 200));
    }

    // Send result back to Client
    res.status(204).json({
      status: 'success',
      requestedAt: req.requestTime,
      results: 0,
      data: {
        data: null
      }
    });

    next();
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const document = await Model.findByIdAndUpdate(req.params.id, req.body, {
      /**
       * NOTE
       * 	Options: {new: true}
       *		-> Return a new Document rather than return original
       *
       * TODO
       * 	Read Mongoose document
       */
      new: true,

      // Run Validators again when we update our data,
      //    to make sure updating documents are in right format
      runValidators: true
    });

    // Send result back to Client
    res.status(200).json({
      status: 'success',
      requestedAt: req.requestTime,
      results: document.length,
      data: {
        data: document
      }
    });

    next();
  });

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const document = await Model.create(req.body);

    // Send result back to Client
    res.status(201).json({
      status: 'success',
      requestedAt: req.requestTime,
      results: document.length,
      data: {
        data: document
      }
    });

    next();
  });

exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    /* We only use "await" in the end, when the query is fulfilled 
		& ready to fetch */

    // Only save the a variable, not use await
    let query = Model.findById(req.params.id);

    // Add some features to query
    if (popOptions) query = query.populate(popOptions);

    // Finally we "await" the query
    const document = await query;

    if (!document) {
      return next(new AppError('No document found with that ID'), 404);
    }

    // Send result back to Client
    res.status(200).json({
      status: 'success',
      requestedAt: req.requestTime,
      results: document.length,
      data: {
        data: document
      }
    });

    next();
  });

exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    /* Only for Reviews, allow nested query to perform */
    let filter = {};
    // Check if there is an ID
    if (req.params.customerID) filter = { customer: req.params.customerID };
    /* ---------------- */

    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    // Add an explain option for more details about query
    // const document = await features.query.explain();
    const document = await features.query;

    // Send result back to Client
    res.status(200).json({
      status: 'success',
      requestedAt: req.requestTime,
      // results: document.length,
      data: {
        data: document
      }
    });

    next();
  });
