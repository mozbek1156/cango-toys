const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { readDB, writeDB } = require('../db');
const authMiddleware = require('../middleware/auth');

// GET all products (with optional filters)
router.get('/', (req, res) => {
  const db = readDB();
  let products = db.products;
  
  const { category, featured, search, min_price, max_price } = req.query;
  
  if (category) products = products.filter(p => {
    const cat = db.categories.find(c => c.id === p.category);
    return cat && (cat.slug === category || cat.id === category);
  });
  if (featured === 'true') products = products.filter(p => p.featured);
  if (search) {
    const q = search.toLowerCase();
    products = products.filter(p => p.name.toLowerCase().includes(q) || (p.tags || []).some(t => t.toLowerCase().includes(q)));
  }
  if (min_price) products = products.filter(p => p.price_retail >= parseFloat(min_price));
  if (max_price) products = products.filter(p => p.price_retail <= parseFloat(max_price));
  
  // Enrich with category info
  products = products.map(p => ({
    ...p,
    categoryInfo: db.categories.find(c => c.id === p.category) || null
  }));
  
  res.json(products);
});

// GET single product
router.get('/:id', (req, res) => {
  const db = readDB();
  const product = db.products.find(p => p.id === req.params.id || p.slug === req.params.id);
  if (!product) return res.status(404).json({ message: 'Ürün bulunamadı' });
  
  const categoryInfo = db.categories.find(c => c.id === product.category);
  res.json({ ...product, categoryInfo });
});

// POST create product (admin)
router.post('/', authMiddleware, (req, res) => {
  const db = readDB();
  const { name, category, price_retail, price_wholesale, stock, description, tags, featured, image } = req.body;
  
  if (!name || !category || !price_retail) {
    return res.status(400).json({ message: 'Ad, kategori ve fiyat zorunludur' });
  }
  
  const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-ğüşıöçğüşıöç]/g, '').substring(0, 50) + '-' + Date.now().toString().slice(-4);
  
  const product = {
    id: uuidv4(), name, category, slug,
    price_retail: parseFloat(price_retail),
    price_wholesale: parseFloat(price_wholesale || price_retail * 0.80),
    stock: parseInt(stock || 0),
    featured: !!featured,
    description: description || '',
    tags: Array.isArray(tags) ? tags : (tags ? tags.split(',').map(t => t.trim()) : []),
    image: image || null,
    createdAt: new Date().toISOString()
  };
  
  db.products.push(product);
  writeDB(db);
  res.status(201).json(product);
});

// PUT update product (admin)
router.put('/:id', authMiddleware, (req, res) => {
  const db = readDB();
  const idx = db.products.findIndex(p => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: 'Ürün bulunamadı' });
  
  const updated = { ...db.products[idx], ...req.body, id: req.params.id };
  if (req.body.price_retail) updated.price_retail = parseFloat(req.body.price_retail);
  if (req.body.price_wholesale) updated.price_wholesale = parseFloat(req.body.price_wholesale);
  if (req.body.stock !== undefined) updated.stock = parseInt(req.body.stock);
  if (req.body.tags && typeof req.body.tags === 'string') {
    updated.tags = req.body.tags.split(',').map(t => t.trim());
  }
  
  db.products[idx] = updated;
  writeDB(db);
  res.json(updated);
});

// DELETE product (admin)
router.delete('/:id', authMiddleware, (req, res) => {
  const db = readDB();
  const idx = db.products.findIndex(p => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: 'Ürün bulunamadı' });
  
  db.products.splice(idx, 1);
  writeDB(db);
  res.json({ message: 'Ürün silindi' });
});

module.exports = router;
