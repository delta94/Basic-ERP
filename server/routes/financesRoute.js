const express = require('express');

const router = express.Router();
const financesControllers = require('../controllers/financesControllers');

router.route('/end').post(
  // Close financial period
  financesControllers.closeFinancialPeriod,
  // Create new financial period
  financesControllers.createFinancialPeriod
);

router.route('/latest').get(financesControllers.getLatestFinancialPeriod);

router.route('/:id').get(financesControllers.getFinancialPeriod);

router
  .route('/')
  .get(financesControllers.getAllFinancialPeriods)
  .post(financesControllers.createFinancialPeriod);

module.exports = router;
