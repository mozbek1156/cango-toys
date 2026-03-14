const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { readDB, writeDB } = require('../db');
const authMiddleware = require('../middleware/auth');

// POST create order (public)
router.post('/', (req, res) => {
  const db = readDB();
  const { customer, items, type, notes } = req.body;

  if (!customer || !items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: 'Müşteri bilgisi ve ürünler zorunludur' });
  }
  if (!customer.name || !customer.phone || !customer.address) {
    return res.status(400).json({ message: 'Ad, telefon ve adres zorunludur' });
  }

  const orderType = type === 'wholesale' ? 'wholesale' : 'retail';

  // Validate stock and calculate total
  let totalPrice = 0;
  const orderItems = [];
  for (const item of items) {
    const product = db.products.find(p => p.id === item.productId);
    if (!product) return res.status(400).json({ message: `Ürün bulunamadı: ${item.productId}` });
    if (product.stock < item.qty) {
      return res.status(400).json({ message: `'${product.name}' için yeterli stok yok. Mevcut: ${product.stock}` });
    }
    const price = orderType === 'wholesale' ? product.price_wholesale : product.price_retail;
    totalPrice += price * item.qty;
    orderItems.push({
      productId: product.id,
      name: product.name,
      qty: item.qty,
      price,
      subtotal: price * item.qty
    });
  }

  // Wholesale minimums check
  if (orderType === 'wholesale') {
    const settings = db.settings;
    if (totalPrice < settings.wholesale_min_amount) {
      return res.status(400).json({
        message: `Toptan alım için minimum sepet tutarı ₺${settings.wholesale_min_amount}'dir. Mevcut: ₺${totalPrice.toFixed(2)}`
      });
    }
  }

  // Deduct stock
  for (const item of items) {
    const idx = db.products.findIndex(p => p.id === item.productId);
    db.products[idx].stock -= item.qty;
  }

  const orderCode = 'CGT-' + Date.now().toString().slice(-6).toUpperCase();
  const order = {
    id: uuidv4(),
    code: orderCode,
    customer,
    items: orderItems,
    type: orderType,
    totalPrice,
    status: 'pending',
    notes: notes || '',
    createdAt: new Date().toISOString()
  };

  db.orders.push(order);
  writeDB(db);
  res.status(201).json({ message: 'Sipariş oluşturuldu', order });
});

// GET all orders (admin)
router.get('/', authMiddleware, (req, res) => {
  const db = readDB();
  const { status, type } = req.query;
  let orders = [...db.orders].reverse();
  if (status) orders = orders.filter(o => o.status === status);
  if (type) orders = orders.filter(o => o.type === type);
  res.json(orders);
});

// GET single order (admin)
router.get('/:id', authMiddleware, (req, res) => {
  const db = readDB();
  const order = db.orders.find(o => o.id === req.params.id || o.code === req.params.id);
  if (!order) return res.status(404).json({ message: 'Sipariş bulunamadı' });
  res.json(order);
});

// PATCH update status (admin)
router.patch('/:id/status', authMiddleware, (req, res) => {
  const db = readDB();
  const idx = db.orders.findIndex(o => o.id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: 'Sipariş bulunamadı' });
  db.orders[idx].status = req.body.status;
  db.orders[idx].updatedAt = new Date().toISOString();
  writeDB(db);
  res.json(db.orders[idx]);
});

// GET stats (admin dashboard)
router.get('/stats/summary', authMiddleware, (req, res) => {
  const db = readDB();
  const total = db.orders.length;
  const pending = db.orders.filter(o => o.status === 'pending').length;
  const completed = db.orders.filter(o => o.status === 'completed').length;
  const revenue = db.orders.filter(o => o.status !== 'cancelled').reduce((sum, o) => sum + o.totalPrice, 0);
  const productCount = db.products.length;
  const lowStock = db.products.filter(p => p.stock < 5).length;
  res.json({ total, pending, completed, revenue, productCount, lowStock });
});

module.exports = router;
