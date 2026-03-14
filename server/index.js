const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Static files
app.use(express.static(path.join(__dirname, '../public')));

// DB initialization
const DB_PATH = path.join(__dirname, 'db.json');
if (!fs.existsSync(DB_PATH)) {
  const { initDB } = require('./db');
  initDB();
}

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/orders', require('./routes/orders'));

// Serve admin pages
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/admin/login.html'));
});
app.get(/^\/admin\/(.*)$/, (req, res) => {
  const file = req.params[0];
  const filePath = path.join(__dirname, '../public/admin', file);
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.sendFile(path.join(__dirname, '../public/admin/login.html'));
  }
});

// Catch-all → index.html
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.listen(PORT, () => {
  console.log(`\n🎉 Cango Toys sunucusu başlatıldı!`);
  console.log(`📦 http://localhost:${PORT}`);
  console.log(`🔒 Admin Panel: http://localhost:${PORT}/admin\n`);
});
