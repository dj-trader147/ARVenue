const express = require('express');
const router = express.Router();
const multer = require('multer');
const productController = require('../controllers/productController');

// Use Memory Storage for direct buffer upload to Cloudinary CDN
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: { fileSize: 100 * 1024 * 1024 } // 100MB max limit for video/images
});

const cpUpload = upload.fields([
  { name: 'imageFile', maxCount: 1 },
  { name: 'videoFile', maxCount: 1 }
]);

router.get('/', productController.getProducts);
router.get('/:slug', productController.getProductBySlug);
router.post('/', cpUpload, productController.createProduct);
router.delete('/:id', productController.deleteProduct);

module.exports = router;
