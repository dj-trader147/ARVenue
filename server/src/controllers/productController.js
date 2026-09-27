const Product = require('../models/Product');

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

// POST /api/products (Create Product with File Upload or URL)
exports.createProduct = async (req, res) => {
  try {
    const { name, price, department, category, style, description, imageUrl, videoUrl, colors, sizes } = req.body;

    if (!name || !price || !department || !category) {
      return res.status(400).json({ success: false, message: 'Please provide name, price, department, and category.' });
    }

    // Process image file or URL
    let finalImageUrl = imageUrl || '';
    if (req.files && req.files['imageFile'] && req.files['imageFile'][0]) {
      finalImageUrl = '/uploads/images/' + req.files['imageFile'][0].filename;
    }

    // Process video file or URL
    let finalVideoUrl = videoUrl || '';
    if (req.files && req.files['videoFile'] && req.files['videoFile'][0]) {
      finalVideoUrl = '/uploads/videos/' + req.files['videoFile'][0].filename;
    }

    // Default fallback image if nothing uploaded/pasted
    if (!finalImageUrl) {
      finalImageUrl = 'https://images.unsplash.com/photo-1620806956627-2c9c7f66a203?w=800&q=80';
    }

    // Generate unique slug
    let baseSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    let slug = baseSlug;
    let count = 1;
    while (await Product.findOne({ slug })) {
      slug = `${baseSlug}-${count}`;
      count++;
    }

    // Parse array fields if passed as JSON string via FormData
    let parsedColors = [];
    if (colors) {
      try { parsedColors = typeof colors === 'string' ? JSON.parse(colors) : colors; } catch (e) {
        parsedColors = String(colors).split(',').map(s => s.trim()).filter(Boolean);
      }
    }

    let parsedSizes = [];
    if (sizes) {
      try { parsedSizes = typeof sizes === 'string' ? JSON.parse(sizes) : sizes; } catch (e) {
        parsedSizes = String(sizes).split(',').map(s => s.trim()).filter(Boolean);
      }
    }

    const product = await Product.create({
      name,
      slug,
      price: Number(price),
      department: department.toLowerCase(),
      category: category.trim(),
      style: style || 'Casual',
      description: description || '',
      images: [finalImageUrl],
      video: finalVideoUrl,
      colors: parsedColors,
      sizes: parsedSizes
    });

    res.status(201).json({ success: true, product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE /api/products/:id
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
