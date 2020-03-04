const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');

exports.deleteOne = Model =>
	catchAsync(async (req, res, next) => {
		const doc = await Model.findByIdAndDelete(req.params.id);

		if (!doc) {
			return next(new AppError('No document found with that ID', 200));
		}

		res.status(204).json({
      statusCode: 204,
      message:'API Posted successfully',
      api_name: 'Delete Document',
      api_description: 'This API is for deleting documents when specify the model',
      api_data: null
		});
	});

exports.updateOne = Model =>
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

		res.status(200).json({
      statusCode: 200,
      status: 'API Updated successfully',
      api_name: 'Update Document',
      api_description: 'This API is for updating documents when specify the model',
      api_data: {
        data: document
			}
		});
	});

exports.createOne = Model =>
	catchAsync(async (req, res, next) => {
        console.log(req.body);
		const document = await Model.create(req.body);
		res.status(200).json({
			statusCode: 200,
			status: 'API Created successfully',
      api_name: 'Create Document',
      api_description: 'This API is for creating documents when specify the model',
			api_data: {
        data: document
			}
		});
	});

exports.getOne = (Model, popOptions) =>
	catchAsync(async (req, res, next) => {
		/* We only use "await" in the end, when the query is fulfilled 
		& ready to fetch */

		// Only save the a variable, not use await
		let query = Model.findById(req.params.id);

		// Add some features to query
		if (popOptions) query = query.populate(popOptions);

		//Finally we "await" the query
		const document = await query;

		if (!document) {
			return next(new AppError('No document found with that ID'), 404);
		}

		res.status(200).json({
			statusCode: 200,
			status: 'API Fetched successfully',
      api_name: 'Fetch Document',
      api_description: 'This API is for fetching documents when specify the model',
			api_data: {
				data: document
			}
		});
	});

exports.getAll = Model =>
	catchAsync(async (req, res, next) => {
		/* Only for Reviews, allow nested query to perform */
		let filter = {};
		//Check if there is an ID
		if (req.params.customerID) filter = { customer: req.params.customerID };
		/* ---------------- */
    console.log(req.query);
    console.log(req.params);
    
		const features = new APIFeatures(Model.find(filter), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

		//Add an explain option for more details about query
		//const doc = await features.query.explain();
		const doc = await features.query;

		//Send result back to Client
		res.status(200).json({
			status: 'success',
			requestedAt: req.requestTime,
			results: doc.length,
			data: {
				data: doc
			}
		});
	});