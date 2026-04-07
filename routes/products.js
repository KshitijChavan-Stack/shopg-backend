const express = require('express');
const Product = require('../models/Product');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

// ─── GET /api/products ────────────────────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const { category, search, page = 1, limit = 10 } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (search) filter.name = { $regex: search, $options: 'i' };

    const pageConfig = parseInt(page);
    const limitConfig = parseInt(limit);
    const skip = (pageConfig - 1) * limitConfig;

    const products = await Product.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitConfig);

    const total = await Product.countDocuments(filter);

    res.json({
      success: true,
      count: products.length,
      total,
      page: pageConfig,
      pages: Math.ceil(total / limitConfig),
      products,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── GET /api/products/trending ───────────────────────────────────────────────
router.get('/trending', async (req, res) => {
  try {
    const products = await Product.aggregate([{ $sample: { size: 12 } }]);
    res.json({ success: true, products });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── GET /api/products/:id ────────────────────────────────────────────────────
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── POST /api/products ───────────────────────────────────────────────────────
router.post('/', protect, admin, async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ success: true, message: 'Product created', product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── PUT /api/products/:id ────────────────────────────────────────────────────
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, message: 'Product updated', product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── DELETE /api/products/:id ─────────────────────────────────────────────────
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});


// ─── POST /api/products/bulk ──────────────────────────────────────────────────
router.post('/bulk', protect, admin, async (req, res) => {
  try {
    const products = req.body;
    if (!Array.isArray(products)) {
      return res.status(400).json({ success: false, message: 'Invalid data format. Expected an array.' });
    }
    const seedData = await Product.insertMany(products);
    res.status(201).json({ success: true, message: `Successfully added ${seedData.length} products`, products: seedData });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});


// ─── POST /api/products/seed ──────────────────────────────────────────────────
// Run once to populate DB with all original ShopG products
router.post('/seed', async (req, res) => {
  try {
    await Product.deleteMany({});

    const products = [
      // ── Grocery ──────────────────────────────────────────────────────────────
      { name: 'Parle-G', price: 10, category: 'grocery', image: 'parleg.jpg', stock: 50 },
      { name: 'Amul Bread', price: 25, category: 'grocery', image: 'bread.png', stock: 50 },
      { name: 'Britannia Toast', price: 25, category: 'grocery', image: 'britanniatoast.png', stock: 50 },
      { name: 'Fortune Oil', price: 180, category: 'grocery', image: 'fortuneoil.png', stock: 50 },
      { name: 'Madhur Sugar', price: 40, category: 'grocery', image: 'sugar.png', stock: 50 },
      { name: 'Besan', price: 55, category: 'grocery', image: 'besan.jpg', stock: 50 },
      { name: 'Moong Dal', price: 48, category: 'grocery', image: 'moong dal.jpg', stock: 50 },
      { name: 'Unpolished Moong Dal', price: 58, category: 'grocery', image: 'moong.jpg', stock: 50 },
      { name: 'Red Label Tea Powder', price: 176, category: 'grocery', image: 'tea pawoder.jpg', stock: 50 },
      { name: 'Camel Sago', price: 99, category: 'grocery', image: 'sago.jpeg', stock: 50 },
      { name: 'Fresh Maida', price: 29, category: 'grocery', image: 'maida.jpg', stock: 50 },
      { name: 'Masoor Dal', price: 47, category: 'grocery', image: 'masoor dal.jpg', stock: 50 },
      { name: 'Dhoop', price: 14, category: 'grocery', image: 'dhoop.png', stock: 50 },
      { name: 'Amul Shudh Ghee', price: 199, category: 'grocery', image: 'ghee.png', stock: 50 },
      { name: 'Poha', price: 98, category: 'grocery', image: 'poha.jpg', stock: 50 },
      { name: 'Papad', price: 12, category: 'grocery', image: 'papad.png', stock: 50 },
      { name: 'Peanut', price: 59, category: 'grocery', image: 'peanut.jpeg', stock: 50 },
      { name: 'Chana Dal', price: 75, category: 'grocery', image: 'chana dal.jpeg', stock: 50 },

      // ── Spices ───────────────────────────────────────────────────────────────
      { name: 'Sambar Masala', price: 47, category: 'spices', image: 'samber masala.jpg', stock: 50 },
      { name: 'Jeera Powder', price: 33, category: 'spices', image: 'jira powder .png', stock: 50 },
      { name: 'Jeera', price: 27, category: 'spices', image: 'jira.jpg', stock: 50 },
      { name: 'Coriander Powder', price: 47, category: 'spices', image: 'corinder powder.png', stock: 50 },
      { name: 'Mutton Gravy Mix', price: 25, category: 'spices', image: 'grevi masala.jpg', stock: 50 },
      { name: 'Chicken Masala', price: 44, category: 'spices', image: 'chicken masala.jpg', stock: 50 },
      { name: 'Rambandhu Papad Masala', price: 60, category: 'spices', image: 'papad masala.png', stock: 50 },
      { name: 'Mirchi Powder', price: 57, category: 'spices', image: 'mirchi powder.png', stock: 50 },
      { name: 'Turmeric Powder', price: 49, category: 'spices', image: 'haldi powder.jpg', stock: 50 },
      { name: 'Ambari Chatpat Masala', price: 65, category: 'spices', image: 'chatpat.png', stock: 50 },
      { name: 'Rambandhu Achar Masala', price: 79, category: 'spices', image: 'achar masala.png', stock: 50 },

      // ── Personal Care ─────────────────────────────────────────────────────────
      { name: 'Cinthol Soap', price: 10, category: 'personalcare', image: 'cinthol.jpeg', stock: 50 },
      { name: 'Pears Soap', price: 25, category: 'personalcare', image: 'pears.png', stock: 50 },
      { name: 'Dove Soap', price: 25, category: 'personalcare', image: 'dove.jpg', stock: 50 },
      { name: 'Red Harpic', price: 180, category: 'personalcare', image: 'red.jpg', stock: 50 },
      { name: 'Garnier Face Wash', price: 40, category: 'personalcare', image: 'garnier1.jpeg', stock: 50 },
      { name: 'Himalaya Face Wash', price: 55, category: 'personalcare', image: 'himalaya.jpeg', stock: 50 },
      { name: 'Lizol', price: 179, category: 'personalcare', image: 'lizol.jpg', stock: 50 },
      { name: 'Vaseline Body Lotion', price: 58, category: 'personalcare', image: 'vaseline b.jpeg', stock: 50 },
      { name: 'Moisturising Cream', price: 176, category: 'personalcare', image: 'man.png', stock: 50 },
      { name: 'Cetaphil Moisturising', price: 99, category: 'personalcare', image: 'cetaphil.jpg', stock: 50 },
      { name: 'Parachute Hair Oil', price: 139, category: 'personalcare', image: 'parachute.png', stock: 50 },
      { name: 'Navratna Hair Oil', price: 69, category: 'personalcare', image: 'navratna.jpeg', stock: 50 },
      { name: 'Bathroom Cleaner', price: 70, category: 'personalcare', image: 'cleanar.jpg', stock: 50 },
      { name: 'Hamam Soap', price: 28, category: 'personalcare', image: 'hamam.jpg', stock: 50 },
      { name: 'Glass Cleaner', price: 98, category: 'personalcare', image: 'ultra.jpg', stock: 50 },
      { name: 'Ariel Powder', price: 88, category: 'personalcare', image: 'ariel.jpg', stock: 50 },
      { name: 'Wild Stone Perfume', price: 249, category: 'personalcare', image: 'wild stone.jpeg', stock: 50 },
      { name: 'Surf Liquid', price: 130, category: 'personalcare', image: 'surf.jpg', stock: 50 },
      { name: 'Lux Soap', price: 25, category: 'personalcare', image: 'lux.jpg', stock: 50 },
      { name: 'Dish Wash Liquid', price: 98, category: 'personalcare', image: 'dish wash.jpg', stock: 50 },

      // ── Baby Care ─────────────────────────────────────────────────────────────
      { name: 'Himalaya Baby Soap', price: 49, category: 'babycare', image: 'baby soap.jpg', stock: 50 },
      { name: 'Baby Oil', price: 75, category: 'babycare', image: 'baby oil.png', stock: 50 },
      { name: 'Baby Powder', price: 122, category: 'babycare', image: 'baby pawoder.jpg', stock: 50 },
      { name: 'Baby Lotion', price: 180, category: 'babycare', image: 'baby lotion.jpg', stock: 50 },

      // ── Beauty ────────────────────────────────────────────────────────────────
      { name: 'Foundation', price: 149, category: 'beauty', image: 'foundation.jpeg', stock: 50 },
      { name: 'Kenra Shampoo', price: 250, category: 'beauty', image: 'kenra.jpg', stock: 50 },
      { name: 'Beauty Blender', price: 99, category: 'beauty', image: 'original.jpg', stock: 50 },
      { name: 'Makeup Enhancer', price: 180, category: 'beauty', image: 'meckup.jpg', stock: 50 },
      { name: 'Face Scrub for Men', price: 190, category: 'beauty', image: 'scrub.jpg', stock: 50 },
    ];

    await Product.insertMany(products);
    res.json({ success: true, message: `Seeded ${products.length} products` });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
