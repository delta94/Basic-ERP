const express = require('express');

const router = express.Router();
const customersController = require('../controllers/customersControllers');

router.route('/:id').get(customersController.getCustomer);

router
  .route('/')
  .get(customersController.getAllCustomers)
  .post(customersController.createCustomer);

module.exports = router;
