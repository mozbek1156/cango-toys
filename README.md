# 🧸 Cango Toys - E-Commerce Platform

Cango Toys, hem perakende hem de toptan satış yapabilen, modern arayüzlü ve tam ölçekli bir e-ticaret (oyuncak mağazası) projesidir. Node.js backend altyapısı ve yenilikçi "glassmorphism" tasarım dokunuşlarına sahip saf Frontend (HTML/CSS/JS) kullanılarak geliştirilmiştir.

## ✨ Özellikler

### 🛍️ Müşteri (Ön Yüz) Özellikleri
- **Toptan & Perakende Modu:** Sepet üzerindeki tutarlara göre dinamik toptan fiyatlandırma ve indirim kontrolü. (Örn: 500₺ üzeri toptan sipariş kabulü).
- **Gelişmiş Ürün Filtreleme:** Kategori bazlı gezinme, fiyata göre sıralama ve canlı arama özellikleri.
- **Sepet Yönetimi:** LocalStorage entegrasyonu sayesinde sekme kapatılsa bile kaybolmayan akıllı sepet sistemi.
- **Mobil Uyumluluk:** Her cihaza (telefon, tablet, masaüstü) tam uyumlu duyarlı (responsive) tasarım ve kaydırmalı (carousel) görünümler.

### 🛡️ Admin (Yönetim Paneli) Özellikleri
- **Güvenli Giriş Sistemi:** `bcrypt` ile şifrelenmiş parolalar ve JWT (JSON Web Token) tabanlı güvenli oturum yönetimi.
- **Dashboard:** Anlık sipariş sayıları, sistemdeki kazanılan gelir ve azalan stok(lar) için uyarı sistemi.
- **Ürün Yönetimi (CRUD):** Modal pencerelerle hızlı ürün ekleme, toptan/perakende fiyat belirleme, silme ve düzenleme imkanı.
- **Sipariş Yönetimi:** Müşteri paneline düşen siparişleri "Beklemede", "Hazırlanıyor", "Tamamlandı" gibi statülere ayırma ve filtreleme.

## 🚀 Teknolojiler
- **Backend:** Node.js, Express.js
- **Veritabanı:** JSON File-DB (`lowdb` mantığıyla kalıcı veri saklama)
- **Güvenlik:** `jsonwebtoken` (JWT), `bcryptjs`
- **Frontend Tasarımı:** Vanilla HTML5, Özel CSS3 (Değişken odaklı CSS mimarisi), Vanilla JavaScript (ES6+).

## ⚙️ Kurulum & Çalıştırma

Geliştirme ortamınızda (Local bilgisayarınızda) çalıştırmak için aşağıdaki adımları izleyin:

1. Repoyu bilgisayarınıza indirin (clone):
   ```bash
   git clone https://github.com/mozbek1156/cango-toys.git
   cd cango-toys
   ```

2. Gerekli kütüphaneleri yükleyin:
   ```bash
   npm install
   ```

3. Sunucuyu başlatın:
   ```bash
   npm start
   ```

4. Tarayıcınızı açın:
   - **Müşteri Sitesi:** `http://localhost:3001`
   - **Admin Paneli:** `http://localhost:3001/admin/login.html`

### 🔑 Varsayılan Admin Giriş Bilgileri
- **Kullanıcı Adı:** `admin`
- **Şifre:** `12345`

---
*Cango Toys – Oyunun Kalbi Burada Atar!* 🎉
