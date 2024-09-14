const mongoose = require('mongoose');


const shopSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  location: {
    type: { type: String, default: 'Point' },  
    coordinates: { type: [Number], required: true }, 
  },
  items: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item' }],  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});


shopSchema.index({ location: '2dsphere' });

const Shop = mongoose.model('Shop', shopSchema);

module.exports = Shop;
