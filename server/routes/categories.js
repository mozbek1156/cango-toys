const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { readDB, writeDB } = require('../db');
const authMiddleware = require('../middleware/auth');

// GET all categories
router.get('/', (req, res) => {
  const db = readDB();
  const cats = db.categories.map(cat => ({
    ...cat,
    productCount: db.products.filter(p => p.category === cat.id).length
  }));
  res.json(cats);
});

// POST create (admin)
router.post('/', authMiddleware, (req, res) => {
  const db = readDB();
  const { name, slug, icon, description } = req.body;
  if (!name || !slug) return res.status(400).json({ message: 'Ad ve slug zorunludur' });
  
  if (db.categories.find(c => c.slug === slug)) {
    return res.status(400).json({ message: 'Bu slug zaten kullanılıyor' });
  }
  
  const category = { id: uuidv4(), name, slug, icon: icon || '📦', description: description || '' };
  db.categories.push(category);
  writeDB(db);
  res.status(201).json(category);
});

// PUT update (admin)
router.put('/:id', authMiddleware, (req, res) => {
  const db = readDB();
  const idx = db.categories.findIndex(c => c.id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: 'Kategori bulunamadı' });
  db.categories[idx] = { ...db.categories[idx], ...req.body, id: req.params.id };
  writeDB(db);
  res.json(db.categories[idx]);
});

// DELETE (admin)
router.delete('/:id', authMiddleware, (req, res) => {
  const db = readDB();
  const productCount = db.products.filter(p => p.category === req.params.id).length;
  if (productCount > 0) {
    return res.status(400).json({ message: `Bu kategoride ${productCount} ürün var. Önce ürünleri taşıyın.` });
  }
  db.categories = db.categories.filter(c => c.id !== req.params.id);
  writeDB(db);
  res.json({ message: 'Kategori silindi' });
});

module.exports = router;
