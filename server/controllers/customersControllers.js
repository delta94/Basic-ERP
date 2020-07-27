const Customer = require('../models/customersModel');
const factory = require('./apifactory/controllerFactory');

exports.createCustomer = factory.createOne(Customer);
exports.updateCustomer = factory.updateOne(Customer);
exports.deleteCustomer = factory.deleteOne(Customer);
exports.getCustomer = factory.getOne(Customer);
exports.getAllCustomers = factory.getAll(Customer);
