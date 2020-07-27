const express = require('express');

const router = express.Router();
const fxControllers = require('../controllers/fxControllers');

router.route('/').get(fxControllers.getAUD_VND_rateAPI);

module.exports = router;
