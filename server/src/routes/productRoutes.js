const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const productController = require('../controllers/productController');

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === 'imageFile') {
      const dir = path.join(__dirname, '../../uploads/images');
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      cb(null, dir);
    } else if (file.fieldname === 'videoFile') {
      const dir = path.join(__dirname, '../../uploads/videos');
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      cb(null, dir);
    } else {
      cb(null, path.join(__dirname, '../../uploads'));
    }
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'product-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 100 * 1024 * 1024 } // 100MB max
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
