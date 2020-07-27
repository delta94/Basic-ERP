const express = require('express');

const router = express.Router();
const stockingControllers = require('../controllers/stockingControllers');
const financesControllers = require('../controllers/financesControllers');

router.route('/import').post(
  // attach financial ref
  financesControllers.attachFinanceRef,
  stockingControllers.importStock,
  // Add dependencies
  financesControllers.gatherDependencies
);

router.route('/history').get(stockingControllers.getStockingHistory);
module.exports = router;
