const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.get('/', productController.getProducts);
router.get('/:slug', productController.getProductBySlug);
router.post('/', productController.createProduct);
router.delete('/:id', productController.deleteProduct);

module.exports = router;
