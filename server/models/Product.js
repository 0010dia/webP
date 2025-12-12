const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: [String],
    required: true
  },
  material: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  discountRate: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  images: {
    type: [String],
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  is_on_sale: {
    type: Boolean,
    default: false
  },
  sizes: [{
    size: {
      type: Number,
      required: true
    },
    available: {
      type: Boolean,
      default: true
    }
  }]
});

// 할인가 계산 가상 필드
productSchema.virtual('discountedPrice').get(function() {
  return Math.floor(this.price * (1 - this.discountRate / 100));
});

// 신제품 여부 확인 (1달 이내)
productSchema.virtual('isNewProduct').get(function() {
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
  return this.createdAt >= oneMonthAgo;
});

// JSON 변환 시 가상 필드 포함
productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Product', productSchema);
