const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/shopg';

const products = [
  // ── Grocery ──────────────────────────────────────────────────────────────
  { 
    name: 'Amul Gold Milk 1L', 
    price: 66, 
    category: 'grocery', 
    brand: 'Amul',
    description: 'Fresh and creamy full cream milk, perfect for tea, coffee, and desserts.',
    image: 'https://media.istockphoto.com/id/1168213768/photo/milk-carton-isolated-on-white-background.jpg?s=612x612&w=0&k=20&c=6-hB-8O3N-77d7p-rZ-0-Y-0-O-0-O-0-O-0-O-0-O-0-E='
  },
  { 
    name: 'India Gate Basmati Rice 5kg', 
    price: 549, 
    category: 'grocery', 
    brand: 'India Gate',
    description: 'Aromatic, long-grain basmati rice for that perfect biryani experience.',
    image: 'https://media.istockphoto.com/id/1154370446/photo/basmati-rice-bag-isolated-on-white.jpg?s=612x612&w=0&k=20&c=N-N-N-N-N-N-N-N-N-N-N-N-N-N-N-N-N-N-N-N-N-E='
  },
  { 
    name: 'Fortune Sun Lite Refined Oil 1L', 
    price: 145, 
    category: 'grocery', 
    brand: 'Fortune',
    description: 'Light and healthy refined sunflower oil, rich in vitamins.',
    image: 'https://media.istockphoto.com/id/1283626781/photo/sunflower-oil-bottle-isolated-on-white.jpg?s=612x612&w=0&k=20&c=O-O-O-O-O-O-O-O-O-O-O-O-O-O-O-O-O-O-O-O-O-E='
  },
  { 
    name: 'Tata Salt 1kg', 
    price: 28, 
    category: 'grocery', 
    brand: 'Tata',
    description: 'Desh ka Namak - Vacuum evaporated iodized salt.',
    image: 'https://media.istockphoto.com/id/1324706536/photo/salt-bag-isolated-on-white.jpg?s=612x612&w=0&k=20&c=S-S-S-S-S-S-S-S-S-S-S-S-S-S-S-S-S-S-S-S-S-E='
  },
  { 
    name: 'Patanjali Atta 5kg', 
    price: 245, 
    category: 'grocery', 
    brand: 'Patanjali',
    description: 'Chakki fresh whole wheat atta for soft and tasty rotis.',
    image: 'https://media.istockphoto.com/id/1218826781/photo/wheat-flour-bag-isolated-on-white.jpg?s=612x612&w=0&k=20&c=W-W-W-W-W-W-W-W-W-W-W-W-W-W-W-W-W-W-W-W-W-E='
  },

  // ── Spices ───────────────────────────────────────────────────────────────
  { 
    name: 'Everest Turmeric Powder 200g', 
    price: 55, 
    category: 'spices', 
    brand: 'Everest',
    description: 'Pure and aromatic turmeric powder sourced from the finest farms.',
    image: 'https://media.istockphoto.com/id/1154370446/photo/turmeric-powder-box-isolated-on-white.jpg?s=612x612&w=0&k=20&c=T-T-T-T-T-T-T-T-T-T-T-T-T-T-T-T-T-T-T-T-T-E='
  },
  { 
    name: 'MDH Garam Masala 100g', 
    price: 85, 
    category: 'spices', 
    brand: 'MDH',
    description: 'A blend of premium spices to give your curries a rich and spicy flavor.',
    image: 'https://media.istockphoto.com/id/1154370446/photo/spice-box-isolated-on-white.jpg?s=612x612&w=0&k=20&c=M-M-M-M-M-M-M-M-M-M-M-M-M-M-M-M-M-M-M-M-M-E='
  },
  { 
    name: 'Catch Kashmiri Mirch 100g', 
    price: 95, 
    category: 'spices', 
    brand: 'Catch',
    description: 'Gives your food a deep red color without excessive heat.',
    image: 'https://media.istockphoto.com/id/1154370446/photo/chili-powder-isolated-on-white.jpg?s=612x612&w=0&k=20&c=C-C-C-C-C-C-C-C-C-C-C-C-C-C-C-C-C-C-C-C-C-E='
  },

  // ── Personal Care ─────────────────────────────────────────────────────────
  { 
    name: 'Dettol Original Soap 125g', 
    price: 45, 
    category: 'personalcare', 
    brand: 'Dettol',
    description: 'Trusted Dettol protection with a fresh fragrance.',
    image: 'https://media.istockphoto.com/id/1283626781/photo/soap-bar-isolated-on-white.jpg?s=612x612&w=0&k=20&c=D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-E='
  },
  { 
    name: 'Colgate Strong Teeth 200g', 
    price: 110, 
    category: 'personalcare', 
    brand: 'Colgate',
    description: 'Double your protection with calcium and arginine boost.',
    image: 'https://media.istockphoto.com/id/1283626781/photo/toothpaste-isolated-on-white.jpg?s=612x612&w=0&k=20&c=C-C-C-C-C-C-C-C-C-C-C-C-C-C-C-C-C-C-C-C-C-E='
  },
  { 
    name: 'Dove Hair Fall Rescue Shampoo 340ml', 
    price: 299, 
    category: 'personalcare', 
    brand: 'Dove',
    description: 'Nourishes from root to tip and reduces hair fall by up to 98%.',
    image: 'https://media.istockphoto.com/id/1283626781/photo/shampoo-bottle-isolated-on-white.jpg?s=612x612&w=0&k=20&c=S-S-S-S-S-S-S-S-S-S-S-S-S-S-S-S-S-S-S-S-S-E='
  },

  // ── Baby Care ─────────────────────────────────────────────────────────────
  { 
    name: 'Johnson\'s Baby Oil 100ml', 
    price: 125, 
    category: 'babycare', 
    brand: 'Johnson\'s',
    description: 'Pure, gentle, and non-sticky baby oil for soft and healthy skin.',
    image: 'https://media.istockphoto.com/id/1154370446/photo/baby-oil-bottle-isolated-on-white.jpg?s=612x612&w=0&k=20&c=J-J-J-J-J-J-J-J-J-J-J-J-J-J-J-J-J-J-J-J-J-E='
  },
  { 
    name: 'Himalaya Baby Lotion 200ml', 
    price: 185, 
    category: 'babycare', 
    brand: 'Himalaya',
    description: 'Natural ingredients to protect and moisturize your baby\'s skin.',
    image: 'https://media.istockphoto.com/id/1154370446/photo/baby-lotion-isolated-on-white.jpg?s=612x612&w=0&k=20&c=H-H-H-H-H-H-H-H-H-H-H-H-H-H-H-H-H-H-H-H-H-E='
  },

  // ── Beauty ────────────────────────────────────────────────────────────────
  { 
    name: 'Lakme Absolute Foundation 30ml', 
    price: 750, 
    category: 'beauty', 
    brand: 'Lakme',
    description: 'Flawless finish and skin protection with built-in primer.',
    image: 'https://media.istockphoto.com/id/1154370446/photo/cosmetic-bottle-isolated-on-white.jpg?s=612x612&w=0&k=20&c=L-L-L-L-L-L-L-L-L-L-L-L-L-L-L-L-L-L-L-L-L-E='
  },
  { 
    name: 'Maybelline Fit Me Matte 30ml', 
    price: 599, 
    category: 'beauty', 
    brand: 'Maybelline',
    description: 'Lightweight matte foundation that fits skin tone and texture.',
    image: 'https://media.istockphoto.com/id/1154370446/photo/makeup-isolated-on-white.jpg?s=612x612&w=0&k=20&c=M-M-M-M-M-M-M-M-M-M-M-M-M-M-M-M-M-M-M-M-M-E='
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB for seeding');
    
    await Product.deleteMany({});
    console.log('🗑️  Cleared existing products');
    
    const seeded = await Product.insertMany(products);
    console.log(`✨ Successfully seeded ${seeded.length} real boutique products`);
    
    process.exit();
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  }
};

seedDB();
