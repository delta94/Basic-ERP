const express = require('express');

const router = express.Router();
const crawlersController = require('../controllers/crawlersControllers');

router.route('/product').get(crawlersController.productCrawler);

module.exports = router;
