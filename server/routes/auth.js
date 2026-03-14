const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { readDB } = require('../db');

const JWT_SECRET = 'cango_toys_secret_jwt_2025';

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const db = readDB();
    
    if (username !== db.admin.username) {
      return res.status(401).json({ message: 'Geçersiz kullanıcı adı veya şifre' });
    }

    const valid = await bcrypt.compare(password, db.admin.password);
    if (!valid) {
      return res.status(401).json({ message: 'Geçersiz kullanıcı adı veya şifre' });
    }

    const token = jwt.sign(
      { username: db.admin.username, role: 'admin' },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ token, name: db.admin.name, message: 'Giriş başarılı!' });
  } catch (err) {
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

router.get('/verify', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ valid: false });
  try {
    jwt.verify(token, JWT_SECRET);
    res.json({ valid: true });
  } catch {
    res.status(401).json({ valid: false });
  }
});

module.exports = router;
module.exports.JWT_SECRET = JWT_SECRET;
