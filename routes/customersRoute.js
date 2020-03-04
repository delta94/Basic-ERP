var express = require('express');
var router = express.Router();
var customersController = require('../controllers/customersController');

router
.route('/:id')
.get(customersController.getCustomer)

router.route('/')
.get(customersController.getAllCustomers)
module.exports = router;
