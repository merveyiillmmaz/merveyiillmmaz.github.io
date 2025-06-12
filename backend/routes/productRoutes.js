const express = require('express');
const router = express.Router();
const Product = require('../models/product.js'); 
const mongoose = require('mongoose'); 

// ÜRÜNLERİ GETİR 
router.get('/', async (req, res) => {
    try {
        let query = {};
        if (req.query.category) {
            query.category = decodeURIComponent(req.query.category);
        }
        const products = await Product.find(query).sort({ createdAt: -1 }); 
        res.json(products);
    } catch (err) {
        console.error("Ürünler getirilirken hata:", err.message, "Sorgu:", req.query);
        res.status(500).json({ message: 'Sunucu hatası: ' + err.message });
    }
});

// TEK BİR ÜRÜNÜ ID'SİNE GÖRE GETİR
router.get('/:id', async (req, res) => {
    try {
        
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'Geçersiz ürün ID formatı.' });
        }

        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Ürün bulunamadı.' });
        }
        res.json(product);
    } catch (err) {
        console.error("Tek ürün getirilirken hata:", err.message);
        res.status(500).json({ message: 'Sunucu hatası: ' + err.message });
    }
});

// YENİ ÜRÜN EKLE
router.post('/', async (req, res) => {
    const { name, imageUrl, category, description, price } = req.body;

   
    if (!name || !imageUrl || !category) {
        return res.status(400).json({ message: 'Lütfen zorunlu alanları doldurun: name, imageUrl, category.' });
    }

    try {
        const newProduct = new Product({
            name,
            imageUrl,
            category,
            description,
            price
        });
        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct); 
    } catch (err) {
        console.error("Ürün eklenirken hata:", err.message, "Gelen veri:", req.body);
        if (err.name === 'ValidationError') {
            let errors = {};
            Object.keys(err.errors).forEach((key) => {
                errors[key] = err.errors[key].message;
            });
            return res.status(400).json({ message: "Veri doğrulama hatası", errors });
        }
        res.status(500).json({ message: 'Sunucu hatası: ' + err.message });
    }
});

// BİR ÜRÜNÜ GÜNCELLE
router.put('/:id', async (req, res) => {
    try {
        
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'Geçersiz ürün ID formatı.' });
        }

        const { name, imageUrl, category, description, price } = req.body;

        

        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            { name, imageUrl, category, description, price },
            { new: true, runValidators: true } 
        );

        if (!updatedProduct) {
            return res.status(404).json({ message: 'Güncellenecek ürün bulunamadı.' });
        }
        res.json(updatedProduct);
    } catch (err) {
        console.error("Ürün güncellenirken hata:", err.message, "Gelen veri:", req.body);
        if (err.name === 'ValidationError') {
            let errors = {};
            Object.keys(err.errors).forEach((key) => {
                errors[key] = err.errors[key].message;
            });
            return res.status(400).json({ message: "Veri doğrulama hatası", errors });
        }
        res.status(500).json({ message: 'Sunucu hatası: ' + err.message });
    }
});

// BİR ÜRÜNÜ SİL
router.delete('/:id', async (req, res) => {
    try {
        
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'Geçersiz ürün ID formatı.' });
        }

        const deletedProduct = await Product.findByIdAndDelete(req.params.id);

        if (!deletedProduct) {
            return res.status(404).json({ message: 'Silinecek ürün bulunamadı.' });
        }
        res.json({ message: 'Ürün başarıyla silindi.', product: deletedProduct });
    } catch (err) {
        console.error("Ürün silinirken hata:", err.message);
        res.status(500).json({ message: 'Sunucu hatası: ' + err.message });
    }
});

module.exports = router;