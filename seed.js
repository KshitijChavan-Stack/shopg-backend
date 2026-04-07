const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/shopg';

const products = [
  { name: 'Amul Gold Milk 1L', price: 66, category: 'grocery', brand: 'Amul', description: 'Fresh and creamy full cream milk.', image: '' },
  { name: 'India Gate Basmati Rice 5kg', price: 549, category: 'grocery', brand: 'India Gate', description: 'Aromatic, long-grain basmati rice.', image: '' },
  { name: 'Fortune Sun Lite Refined Oil 1L', price: 145, category: 'grocery', brand: 'Fortune', description: 'Light and healthy refined sunflower oil.', image: '' },
  { name: 'Tata Salt 1kg', price: 28, category: 'grocery', brand: 'Tata', description: 'Desh ka Namak - vacuum evaporated salt.', image: '' },
  { name: 'Patanjali Atta 5kg', price: 245, category: 'grocery', brand: 'Patanjali', description: 'Chakki fresh whole wheat atta.', image: '' },
  { name: 'Everest Turmeric Powder 200g', price: 55, category: 'spices', brand: 'Everest', description: 'Pure and aromatic turmeric powder.', image: '' },
  { name: 'MDH Garam Masala 100g', price: 85, category: 'spices', brand: 'MDH', description: 'A blend of premium spices.', image: '' },
  { name: 'Catch Kashmiri Mirch 100g', price: 95, category: 'spices', brand: 'Catch', description: 'Gives your food a deep red color.', image: '' },
  { name: 'Dettol Original Soap 125g', price: 45, category: 'personalcare', brand: 'Dettol', description: 'Trusted Dettol protection.', image: '' },
  { name: 'Colgate Strong Teeth 200g', price: 110, category: 'personalcare', brand: 'Colgate', description: 'Double your protection.', image: '' },
  { name: 'Dove Hair Fall Rescue Shampoo 340ml', price: 299, category: 'personalcare', brand: 'Dove', description: 'Nourishes from root to tip.', image: '' },
  { name: 'Johnson\'s Baby Oil 100ml', price: 125, category: 'babycare', brand: 'Johnson\'s', description: 'Pure, gentle, and non-sticky baby oil.', image: '' },
  { name: 'Himalaya Baby Lotion 200ml', price: 185, category: 'babycare', brand: 'Himalaya', description: 'Natural ingredients to protect baby skin.', image: '' },
  { name: 'Lakme Absolute Foundation 30ml', price: 750, category: 'beauty', brand: 'Lakme', description: 'Flawless finish with built-in primer.', image: '' },
  { name: 'Maybelline Fit Me Matte 30ml', price: 599, category: 'beauty', brand: 'Maybelline', description: 'Lightweight matte foundation.', image: '' }
];

const seedDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB for seeding');
    await Product.deleteMany({});
    console.log('🗑️  Cleared existing products');
    const seeded = await Product.insertMany(products);
    console.log(`✨ Successfully seeded ${seeded.length} products with no images`);
    process.exit();
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  }
};

seedDB();
