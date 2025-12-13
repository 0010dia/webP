const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  // 기본 정보
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },

  // 카테고리 (복수 선택 가능)
  category: [{
    type: String,
    enum: ['lifestyle', 'slipon'],
    required: true
  }],

  // 소재
  material: {
    type: String,
    required: true
  },

  // 가격 정보
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

  // 이미지 (최소 2개)
  images: [{
    type: String,
    required: true
  }],

  // 사이즈 정보
  sizes: [{
    size: {
      type: Number,
      required: true
    },
    available: {
      type: Boolean,
      default: true
    }
  }],

  // 세일 여부
  is_on_sale: {
    type: Boolean,
    default: false
  },

  // 판매량 (주문 생성 시 자동 증가)
  salesCount: {
    type: Number,
    default: 0,
    index: true
  },

  // 추천 점수 (정렬용)
  recommendScore: {
    type: Number,
    default: 0,
    index: true
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Virtual: 할인된 가격 계산
ProductSchema.virtual('discountedPrice').get(function() {
  return Math.floor(this.price * (1 - this.discountRate / 100));
});

// Virtual: 신제품 여부 (등록일 기준 1개월 이내)
ProductSchema.virtual('isNewProduct').get(function() {
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
  return this.createdAt >= oneMonthAgo;
});

// JSON 변환 시 virtual 포함
ProductSchema.set('toJSON', { virtuals: true });
ProductSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Product', ProductSchema);
