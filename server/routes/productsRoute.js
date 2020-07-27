const express = require('express');

const router = express.Router();
const productsControllers = require('../controllers/productsControllers');

router.route('/tobuy').get(productsControllers.getToBuyProducts);

router
  .route('/')
  .get(productsControllers.getAllProducts)
  .post(productsControllers.createProduct);

router.route('/:id').patch(productsControllers.updateProduct);

module.exports = router;
