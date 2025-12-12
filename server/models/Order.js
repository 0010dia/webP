const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  // 로그인 기능이 아직 미완성이라면 임시로 string, 완성되었다면 User 참조
  userId: { type: String, required: true, default: 'guest' }, 
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      name: String,
      price: Number,
      size: Number,
      colorName: String,
      image: String,
      quantity: Number
    }
  ],
  totalAmount: { type: Number, required: true },
  status: { type: String, default: 'ordered' }, // ordered, paid, shipping...
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', OrderSchema);