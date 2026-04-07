const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true },
    category: {
      type: String,
      required: true,
      enum: ['grocery', 'spices', 'personalcare', 'babycare', 'beauty'],
    },
    brand: { type: String, default: '' },
    image: { type: String, default: '' }, // image filename or URL
    description: { type: String, default: '' },
    stock: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
