const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema({
  // 로그인한 유저의 ID 또는 비회원 세션 ID
  user_id: { 
    type: String, 
    required: true 
  },
  items: [
    {
      product: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Product', // Product 모델과 조인
        required: true 
      },
      size: { type: Number, required: true },
      quantity: { type: Number, default: 1 },
      // 스키마에 색상 등 옵션 추가 가능
      color: { type: String }
    }
  ],
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Cart', CartSchema);