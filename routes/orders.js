const express = require('express');
const Order = require('../models/Order');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

// ─── POST /api/orders ─────────────────────────────────────────────────────────
router.post('/', protect, async (req, res) => {
  try {
    const { customerName, address, contact, items, totalAmount } = req.body;
    if (!items || items.length === 0)
      return res.status(400).json({ success: false, message: 'No order items provided' });
    if (!customerName || !address || !contact || totalAmount === undefined)
      return res.status(400).json({ success: false, message: 'Customer details required' });

    const order = await Order.create({ userId: req.user._id, customerName, address, contact, items, totalAmount });
    res.status(201).json({ success: true, message: 'Order created successfully', order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── GET /api/orders/myorders ─────────────────────────────────────────────────
router.get('/myorders', protect, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, count: orders.length, orders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── GET /api/orders (Admin only) ─────────────────────────────────────────────
router.get('/', protect, admin, async (req, res) => {
  try {
    const orders = await Order.find({}).sort({ createdAt: -1 });
    res.json({ success: true, count: orders.length, orders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── PATCH /api/orders/:id/status (Admin only) ────────────────────────────────
router.patch('/:id/status', protect, admin, async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status))
      return res.status(400).json({ success: false, message: 'Invalid status value' });

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    if (!order)
      return res.status(404).json({ success: false, message: 'Order not found' });

    res.json({ success: true, message: 'Order status updated', order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
