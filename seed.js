const mongoose = require('mongoose');
require('dotenv').config();
const Product = require('./models/Product');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/shopg';

// Using Cloudinary placeholder URLs (replace YOUR_CLOUD_NAME with your actual Cloudinary cloud name)
// Format: https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/v1/shopg/<filename>
// For now using dummyimage.com as placeholder until real Cloudinary images are uploaded

const CL = (text, color = 'e0e0e0') =>
  `https://dummyimage.com/400x400/${color}/333333.png&text=${encodeURIComponent(text)}`;

const dummyProducts = [
  // ── Grocery ───────────────────────────────────────────────────────────────
  { name: 'Parle-G',             price: 10,  category: 'grocery',      image: CL('Parle-G'),         description: 'Classic glucose biscuits.' },
  { name: 'Amul Bread',          price: 25,  category: 'grocery',      image: CL('Amul Bread'),       description: 'Soft white sandwich bread.' },
  { name: 'Britannia Toast',     price: 25,  category: 'grocery',      image: CL('Toast'),            description: 'Crispy toasted bread slices.' },
  { name: 'Fortune Oil',         price: 180, category: 'grocery',      image: CL('Fortune Oil'),      description: 'Refined sunflower oil, 1L.' },
  { name: 'Madhur Sugar',        price: 40,  category: 'grocery',      image: CL('Sugar'),            description: 'Pure refined white sugar, 1kg.' },
  { name: 'Besan',               price: 55,  category: 'grocery',      image: CL('Besan'),            description: 'Fine ground chickpea flour, 500g.' },
  { name: 'Moong Dal',           price: 48,  category: 'grocery',      image: CL('Moong Dal'),        description: 'Split yellow moong dal, 500g.' },
  { name: 'Red Label Tea',       price: 176, category: 'grocery',      image: CL('Red Label Tea'),    description: 'Strong CTC tea powder, 500g.' },
  { name: 'Camel Sago',          price: 99,  category: 'grocery',      image: CL('Sago'),             description: 'Sabudana / sago pearls, 500g.' },
  { name: 'Fresh Maida',         price: 29,  category: 'grocery',      image: CL('Maida'),            description: 'All-purpose refined flour, 1kg.' },
  { name: 'Masoor Dal',          price: 47,  category: 'grocery',      image: CL('Masoor Dal'),       description: 'Red lentils, unpolished, 500g.' },
  { name: 'Amul Shudh Ghee',    price: 199, category: 'grocery',      image: CL('Amul Ghee'),        description: 'Pure cow ghee, 500ml.' },
  { name: 'Poha',                price: 98,  category: 'grocery',      image: CL('Poha'),             description: 'Flattened rice flakes, 500g.' },
  { name: 'Peanut',              price: 59,  category: 'grocery',      image: CL('Peanut'),           description: 'Raw groundnuts, 500g.' },
  { name: 'Chana Dal',           price: 75,  category: 'grocery',      image: CL('Chana Dal'),        description: 'Split bengal gram, 500g.' },

  // ── Spices ────────────────────────────────────────────────────────────────
  { name: 'Sambar Masala',       price: 47,  category: 'spices',       image: CL('Sambar Masala', 'f5c518'), description: 'Aromatic sambar spice blend, 100g.' },
  { name: 'Jeera Powder',        price: 33,  category: 'spices',       image: CL('Jeera Powder', 'f5c518'),  description: 'Ground cumin powder, 100g.' },
  { name: 'Jeera',               price: 27,  category: 'spices',       image: CL('Jeera', 'f5c518'),         description: 'Whole cumin seeds, 100g.' },
  { name: 'Coriander Powder',    price: 47,  category: 'spices',       image: CL('Coriander', 'f5c518'),     description: 'Ground coriander, 100g.' },
  { name: 'Chicken Masala',      price: 44,  category: 'spices',       image: CL('Chicken Masala', 'f5c518'),description: 'Spice blend for chicken dishes, 100g.' },
  { name: 'Mirchi Powder',       price: 57,  category: 'spices',       image: CL('Mirchi', 'e74c3c'),        description: 'Red chilli powder, 100g.' },
  { name: 'Turmeric Powder',     price: 49,  category: 'spices',       image: CL('Turmeric', 'f39c12'),      description: 'Pure haldi powder, 100g.' },
  { name: 'Achar Masala',        price: 79,  category: 'spices',       image: CL('Achar Masala', 'f5c518'),  description: 'Mixed pickle spice blend, 100g.' },

  // ── Personal Care ─────────────────────────────────────────────────────────
  { name: 'Cinthol Soap',        price: 10,  category: 'personalcare', image: CL('Cinthol'),          description: 'Fresh deodorant soap, 100g.' },
  { name: 'Pears Soap',          price: 25,  category: 'personalcare', image: CL('Pears Soap'),       description: 'Transparent glycerine soap, 75g.' },
  { name: 'Dove Soap',           price: 35,  category: 'personalcare', image: CL('Dove Soap'),        description: 'Moisturizing beauty bar, 100g.' },
  { name: 'Garnier Face Wash',   price: 140, category: 'personalcare', image: CL('Garnier FW'),       description: 'Brightening facewash, 100ml.' },
  { name: 'Himalaya Face Wash',  price: 100, category: 'personalcare', image: CL('Himalaya FW'),      description: 'Neem facewash, 100ml.' },
  { name: 'Vaseline Body Lotion',price: 180, category: 'personalcare', image: CL('Vaseline'),         description: 'Intensive care lotion, 200ml.' },
  { name: 'Parachute Hair Oil',  price: 139, category: 'personalcare', image: CL('Parachute'),        description: '100% pure coconut oil, 200ml.' },
  { name: 'Navratna Hair Oil',   price: 69,  category: 'personalcare', image: CL('Navratna'),         description: 'Cool oil with 9 herbs, 100ml.' },
  { name: 'Ariel Detergent',     price: 88,  category: 'personalcare', image: CL('Ariel'),            description: 'Washing powder, 500g.' },
  { name: 'Wild Stone Perfume',  price: 249, category: 'personalcare', image: CL('Wild Stone'),       description: 'Long-lasting deodorant body spray, 150ml.' },
  { name: 'Surf Excel Liquid',   price: 130, category: 'personalcare', image: CL('Surf Excel'),       description: 'Liquid detergent, 500ml.' },
  { name: 'Lux Soap',            price: 25,  category: 'personalcare', image: CL('Lux Soap'),         description: 'Soft skin beauty soap, 100g.' },
  { name: 'Dish Wash Liquid',    price: 98,  category: 'personalcare', image: CL('Dish Wash'),        description: 'Grease-cutting dish wash gel, 500ml.' },

  // ── Baby Care ─────────────────────────────────────────────────────────────
  { name: 'Himalaya Baby Soap',  price: 49,  category: 'babycare',     image: CL('Baby Soap'),        description: 'Gentle soap for baby skin, 75g.' },
  { name: 'Baby Oil',            price: 75,  category: 'babycare',     image: CL('Baby Oil'),         description: 'Nourishing massage oil, 100ml.' },
  { name: 'Baby Powder',         price: 122, category: 'babycare',     image: CL('Baby Powder'),      description: 'Soft talcum powder, 100g.' },
  { name: 'Baby Lotion',         price: 180, category: 'babycare',     image: CL('Baby Lotion'),      description: 'Moisturizing baby skin lotion, 200ml.' },

  // ── Beauty ────────────────────────────────────────────────────────────────
  { name: 'Foundation',          price: 149, category: 'beauty',       image: CL('Foundation'),       description: 'Lightweight liquid foundation.' },
  { name: 'Kenra Shampoo',       price: 250, category: 'beauty',       image: CL('Kenra Shampoo'),    description: 'Professional volumizing shampoo, 300ml.' },
  { name: 'Beauty Blender',      price: 99,  category: 'beauty',       image: CL('Beauty Blender'),   description: 'Seamless makeup applicator sponge.' },
  { name: 'Makeup Enhancer',     price: 180, category: 'beauty',       image: CL('Makeup'),           description: 'Primer and setting spray combo.' },
  { name: 'Face Scrub for Men',  price: 190, category: 'beauty',       image: CL('Face Scrub'),       description: 'Deep exfoliating face scrub, 100ml.' },
];

mongoose
  .connect(MONGO_URI)
  .then(async () => {
    console.log('Connected to DB');
    await Product.deleteMany({});
    await Product.insertMany(dummyProducts);
    console.log(`✅ Successfully seeded ${dummyProducts.length} products!`);
    process.exit(0);
  })
  .catch((err) => {
    console.error('Error seeding products:', err);
    process.exit(1);
  });
