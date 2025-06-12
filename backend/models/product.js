const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  imageUrl: { 
        type: String,
        required: true
    },
     category: { 
        type: String,
        required: false
    },
   name: { 
        type: String,
        required: [true, 'Ürün adı zorunludur.'], 
        trim: true 
    },
});

module.exports = mongoose.model('Product', productSchema);
