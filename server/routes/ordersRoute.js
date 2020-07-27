const express = require('express');

const router = express.Router();
const ordersControllers = require('../controllers/ordersControllers');
const financesControllers = require('../controllers/financesControllers');

router.route('/:id/ship').post(ordersControllers.shipMultipleItems);
router.route('/:id/pay').post(ordersControllers.createPayment);
router.route('/:id').get(ordersControllers.getOrder);
router.route('/').get(ordersControllers.getAllOrders).post(
  // attach before create
  financesControllers.attachFinanceRef,
  ordersControllers.createOrder,
  // Add dependencies
  financesControllers.gatherDependencies
);

module.exports = router;
