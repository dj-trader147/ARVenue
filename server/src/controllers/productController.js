const Product = require('../models/Product');
const cloudinary = require('cloudinary').v2;
const stream = require('stream');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'vpnutlqp',
  api_key: process.env.CLOUDINARY_API_KEY || '194391765283359',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'iigXW_EIh7n6i4GE5tLXL5v50qE'
});

// Helper function to stream buffer to Cloudinary CDN
const uploadToCloudinary = (buffer, options = {}) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error) return reject(error);
      resolve(result);
    });
    stream.Readable.from(buffer).pipe(uploadStream);
  });
};

// GET /api/products (Fetch with department & category filter)
exports.getProducts = async (req, res) => {
  try {
    const { department, category, style } = req.query;
    let query = { isActive: true };

    if (department) query.department = department.toLowerCase();
    if (category) {
      const cleanCat = String(category).toLowerCase().replace(/-/g, ' ');
      query.$expr = {
        $eq: [
          { $toLower: { $replaceAll: { input: "$category", find: "-", replacement: " " } } },
          cleanCat
        ]
      };
    }
    if (style && style !== 'All') query.style = style;

    const products = await Product.find(query).sort({ createdAt: -1 });
    res.json({ success: true, count: products.length, products });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/products/:slug (Single product details)
exports.getProductBySlug = async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug });
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/products (Create Product with Cloudinary Direct CDN Upload)
exports.createProduct = async (req, res) => {
  try {
    const { name, price, department, category, style, description, colors, sizes } = req.body;

    if (!name || !price || !department || !category) {
      return res.status(400).json({ success: false, message: 'Please provide name, price, department, and category.' });
    }

    let finalImageUrl = '';
    let finalVideoUrl = '';

    // 1. Upload Image to Cloudinary CDN if provided
    if (req.files && req.files['imageFile'] && req.files['imageFile'][0]) {
      const imgFile = req.files['imageFile'][0];
      const result = await uploadToCloudinary(imgFile.buffer, {
        folder: 'arvenue/products/images',
        resource_type: 'image'
      });
      finalImageUrl = result.secure_url;
    }

    // 2. Upload Video to Cloudinary CDN if provided
    if (req.files && req.files['videoFile'] && req.files['videoFile'][0]) {
      const vidFile = req.files['videoFile'][0];
      const result = await uploadToCloudinary(vidFile.buffer, {
        folder: 'arvenue/products/videos',
        resource_type: 'video'
      });
      finalVideoUrl = result.secure_url;
    }

    // Safe JSON Parsing for Colors & Sizes
    let parsedColors = [];
    if (colors) {
      try {
        parsedColors = typeof colors === 'string' ? JSON.parse(colors) : colors;
      } catch (e) {
        parsedColors = colors.split(',').map(c => c.trim()).filter(Boolean);
      }
    }

    let parsedSizes = [];
    if (sizes) {
      try {
        parsedSizes = typeof sizes === 'string' ? JSON.parse(sizes) : sizes;
      } catch (e) {
        parsedSizes = sizes.split(',').map(s => s.trim()).filter(Boolean);
      }
    }

    // Unique Slug Generation
    const baseSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const uniqueSuffix = Date.now().toString(36);
    const slug = `${baseSlug}-${uniqueSuffix}`;

    const product = new Product({
      name,
      slug,
      price: Number(price),
      department: department.toLowerCase(),
      category,
      style: style || 'Casual',
      description: description || '',
      images: finalImageUrl ? [finalImageUrl] : [],
      video: finalVideoUrl || '',
      colors: parsedColors,
      sizes: parsedSizes,
      isActive: true
    });

    await product.save();
    res.status(201).json({ success: true, message: 'Product published successfully to Cloudinary & Live Store', product });
  } catch (err) {
    console.error('Error creating product:', err);
    res.status(500).json({ success: false, message: err.message || 'Server error uploading product' });
  }
};

// DELETE /api/products/:id
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, message: 'Product deleted permanently' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
