// ... diğer require'lar ve ayarlar ...
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // CORS hatalarını önlemek için (farklı portlardan istek gelirse)
require('dotenv').config(); // .env dosyasını kullanmak için

const app = express();

// Middleware'ler
app.use(cors()); // Tüm kaynaklardan gelen isteklere izin ver (geliştirme için)
app.use(express.json()); // Gelen JSON isteklerini parse etmek için

// MongoDB Bağlantısı
// BURAYI DÜZELTİYORUZ: Veritabanı adını 'sanraf' olarak ayarlıyoruz.
const dbURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sanraf';
// Not: Eğer .env dosyasında MONGODB_URI tanımlıysa ve orada farklı bir veritabanı adı varsa,
// orayı da 'mongodb://localhost:27017/sanraf' olarak güncellemen gerekebilir.
// Ya da .env'deki tanımı silip buradaki varsayılanı kullanabilirsin.

mongoose.connect(dbURI)
  .then(() => console.log('MongoDB "sanraf" veritabanına bağlantı başarılı')) // Log mesajını da güncelleyebilirsin
  .catch(err => console.error('MongoDB bağlantı hatası:', err));

// ROTALAR
const productRoutes = require('./routes/productRoutes'); // Bu yolun doğru olduğunu kontrol et
app.use('/api/products', productRoutes); // '/api/products' ile başlayan tüm istekleri productRoutes'a yönlendir

// ... diğer rotalar (varsa) ...

// Basit bir ana sayfa rotası (test için)
app.get('/', (req, res) => {
    res.send('SanRaf Sistemleri API Çalışıyor!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Sunucu ${PORT} portunda çalışıyor`);
});