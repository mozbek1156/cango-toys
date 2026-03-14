const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const DB_PATH = path.join(__dirname, 'db.json');

const defaultDB = {
  categories: [
    { id: "cat1", name: "Oyuncaklar", slug: "oyuncaklar", icon: "🚀", description: "Her yaşa uygun harika oyuncaklar" },
    { id: "cat2", name: "Kırtasiye", slug: "kirtasiye", icon: "✏️", description: "Kaliteli kırtasiye ve okul gereçleri" },
    { id: "cat3", name: "Kutu Oyunları", slug: "kutu-oyunlari", icon: "🎲", description: "Aile ve arkadaş oyunları" },
    { id: "cat4", name: "Figür Setler", slug: "figur-setler", icon: "🦸", description: "Koleksiyon figür ve setler" },
    { id: "cat5", name: "Peluşlar", slug: "peluslar", icon: "🧸", description: "Sevimli peluş oyuncaklar" },
    { id: "cat6", name: "Eğitici Oyuncaklar", slug: "egitici-oyuncaklar", icon: "🧩", description: "Öğrenirken eğlen" },
    { id: "cat7", name: "Açık Hava", slug: "acik-hava", icon: "⛳", description: "Dış mekan eğlence ürünleri" },
    { id: "cat8", name: "Sanat & Hobi", slug: "sanat-hobi", icon: "🎨", description: "Boyalar, çizimler ve el sanatları" }
  ],
  products: [
    {
      id: uuidv4(), name: "Uzay Mekiği Seti", category: "cat1", slug: "uzay-mekigi-seti",
      price_retail: 299.90, price_wholesale: 239.90, stock: 45, featured: true,
      description: "3 farklı uzay aracı, 2 astronot figürü ve uzay üssü içeren kapsamlı uzay seti. 4+ yaş.",
      tags: ["uzay", "set", "çocuk"], image: null
    },
    {
      id: uuidv4(), name: "Lego Klasik Tuğla Seti 500 Parça", category: "cat1", slug: "lego-klasik-tugla-500",
      price_retail: 449.90, price_wholesale: 359.90, stock: 30, featured: true,
      description: "500 parça renkli klasik lego tuğlaları. Yaratıcılığı geliştiren açık uçlu oyun seti. 6+ yaş.",
      tags: ["lego", "inşaat", "yaratıcı"], image: null
    },
    {
      id: uuidv4(), name: "Ahşap Boyama Seti Deluxe", category: "cat8", slug: "ahsap-boyama-seti",
      price_retail: 189.90, price_wholesale: 149.90, stock: 60, featured: true,
      description: "24 renk akrilik boya, 5 çeşit fırça, 10 ahşap obje. Sanatçı çocuklar için mükemmel.",
      tags: ["boyama", "sanat", "ahşap"], image: null
    },
    {
      id: uuidv4(), name: "Monopoly Türkçe Edisyon", category: "cat3", slug: "monopoly-turkce",
      price_retail: 349.90, price_wholesale: 279.90, stock: 25, featured: true,
      description: "Klasik Monopoly'nin Türkçe versiyonu. 2-8 oyuncu, 8+ yaş. Aile eğlencesi garantili!",
      tags: ["monopoly", "kutu oyunu", "aile"], image: null
    },
    {
      id: uuidv4(), name: "Oyuncak Bebek Sofia", category: "cat1", slug: "oyuncak-bebek-sofia",
      price_retail: 259.90, price_wholesale: 204.90, stock: 40, featured: false,
      description: "Gerçekçi tasarım, hareketli eklemler. 3 kıyafet seçeneği ile birlikte. 3+ yaş.",
      tags: ["bebek", "kız", "oyuncak"], image: null
    },
    {
      id: uuidv4(), name: "Avengers Figür Seti 6'lı", category: "cat4", slug: "avengers-figur-seti",
      price_retail: 399.90, price_wholesale: 319.90, stock: 20, featured: true,
      description: "6 süper kahraman figürü: Iron Man, Captain America, Thor, Hulk, Black Widow, Hawkeye. 15cm yükseklik.",
      tags: ["avengers", "marvel", "figür", "süper kahraman"], image: null
    },
    {
      id: uuidv4(), name: "Büyük Ayı Peluş", category: "cat5", slug: "buyuk-ayi-pelus",
      price_retail: 199.90, price_wholesale: 159.90, stock: 35, featured: false,
      description: "60cm yumuşak ve sevimli kahverengi peluş ayı. Hypoallerjen malzeme. 0+ yaş.",
      tags: ["peluş", "ayı", "yumuşak"], image: null
    },
    {
      id: uuidv4(), name: "Kalem Seti 100'lü Profesyonel", category: "cat2", slug: "kalem-seti-100",
      price_retail: 159.90, price_wholesale: 124.90, stock: 80, featured: false,
      description: "50 renkli kuruboya + 30 keçeli kalem + 20 tükenmez kalem seti. Okula dönüş kampanyası.",
      tags: ["kalem", "kırtasiye", "okul"], image: null
    },
    {
      id: uuidv4(), name: "Matematik Öğrenme Tahtası", category: "cat6", slug: "matematik-ogrenme-tahtasi",
      price_retail: 229.90, price_wholesale: 184.90, stock: 50, featured: false,
      description: "Eğlenceli matematiksel hesaplama tahtası. Toplama, çıkarma, çarpma öğretir. 5-10 yaş.",
      tags: ["matematik", "eğitici", "okul öncesi"], image: null
    },
    {
      id: uuidv4(), name: "Bahçe Oyun Seti", category: "cat7", slug: "bahce-oyun-seti",
      price_retail: 279.90, price_wholesale: 219.90, stock: 30, featured: false,
      description: "Kürek, tırmık, sulama kabı ve torba seti. Çocuk bahçeciliği için mükemmel. 3+ yaş.",
      tags: ["bahçe", "açık hava", "doğa"], image: null
    },
    {
      id: uuidv4(), name: "3D Puzzle Eyfel Kulesi", category: "cat3", slug: "3d-puzzle-eyfel",
      price_retail: 189.90, price_wholesale: 149.90, stock: 25, featured: false,
      description: "216 parça kesintisiz 3D köpük puzzle. Tamamlandığında 40cm yükseklik. 8+ yaş.",
      tags: ["puzzle", "3d", "paris"], image: null
    },
    {
      id: uuidv4(), name: "Star Wars Mandalorian Figür", category: "cat4", slug: "mandalorian-figur",
      price_retail: 329.90, price_wholesale: 259.90, stock: 15, featured: false,
      description: "20cm hassas detaylı Mandalorian aksiyon figürü. 14 hareketli eklem, 3 aksesuar.",
      tags: ["star wars", "mandalorian", "koleksiyon"], image: null
    },
    {
      id: uuidv4(), name: "Unicorn Peluş 45cm", category: "cat5", slug: "unicorn-pelus",
      price_retail: 169.90, price_wholesale: 134.90, stock: 55, featured: true,
      description: "Gökkuşağı renkli, glitter detaylı unicorn peluş. Süper yumuşak dolgu. 3+ yaş.",
      tags: ["unicorn", "peluş", "kız"], image: null
    },
    {
      id: uuidv4(), name: "Okul Çantası Seti Basic", category: "cat2", slug: "okul-cantasi-seti",
      price_retail: 349.90, price_wholesale: 279.90, stock: 40, featured: false,
      description: "Sırt çantası + kalemlik + beslenme çantası. Ergonomik tasarım, su geçirmez kumaş.",
      tags: ["çanta", "okul", "set"], image: null
    },
    {
      id: uuidv4(), name: "Kazı-Bul Dinozor Seti", category: "cat6", slug: "kazi-bul-dinozor",
      price_retail: 149.90, price_wholesale: 119.90, stock: 45, featured: false,
      description: "Gerçek fosilleşme simülasyonu. Çekiç ve fırça ile dinozor iskeletini kazan. 6+ yaş.",
      tags: ["dinozor", "kazı", "bilim", "STEM"], image: null
    },
    {
      id: uuidv4(), name: "Bisiklet 20' Çocuk", category: "cat7", slug: "bisiklet-cocuk-20",
      price_retail: 1299.90, price_wholesale: 1039.90, stock: 10, featured: false,
      description: "Alüminyum gövde, 6 vites, V-fren, 20 inç. 6-9 yaş arası için ideal spor bisiklet.",
      tags: ["bisiklet", "açık hava", "spor"], image: null
    }
  ],
  orders: [],
  admin: {
    username: "admin",
    password: "$2a$10$XtBqxwu4Q3Z.9W3fHgfI2.KlMHW9lVv0WUgTu0p6.UxvJb9D1q6Xi",
    name: "Cango Admin"
  },
  settings: {
    wholesale_min_amount: 500,
    wholesale_min_qty: 10,
    wholesale_discount: 0.20,
    currency: "₺",
    store_name: "Cango Toys",
    slogan: "Oyunun Kalbi Burada Atar!",
    phone: "+90 212 000 00 00",
    email: "info@cangotoys.com",
    address: "Örnek Mah. Oyuncak Cad. No:1, İstanbul"
  }
};

function initDB() {
  fs.writeFileSync(DB_PATH, JSON.stringify(defaultDB, null, 2), 'utf8');
  console.log('✅ Veritabanı başlatıldı');
}

function readDB() {
  if (!fs.existsSync(DB_PATH)) initDB();
  return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
}

function writeDB(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
}

module.exports = { initDB, readDB, writeDB };
