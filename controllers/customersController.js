const Customer = require('../models/customersModel');
const factory = require('./handlerFactory');
const catchAsync = require('../utils/catchAsync');

exports.createCustomer = factory.createOne(Customer);
exports.updateCustomer = factory.updateOne(Customer);
exports.deleteCustomer = factory.deleteOne(Customer);
exports.getCustomer = factory.getOne(Customer);

exports.getAllCustomers = catchAsync(async (req, res, next) => {
  /* ------   Search By Name only -------- */
  let doc = await Customer.find({
    $text: {
      $search: req.query.name
    }
  });
  res.status(200).json({
      statusCode: 200,
      status: 'API Fetched successfully',
      api_name: 'Get All Documents with Query',
      api_description: 'This API is for getting documents when specify the model & queries',
      api_data: {
        data: doc
			}
		});
});
