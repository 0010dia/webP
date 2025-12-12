const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  // --- 공통 필수 정보 ---
  name: { type: String, required: true },
  price: { type: Number, required: true }, // 현재 판매가
  
  // --- ListPage.js & Slide.js 호환 필드 ---
  image: { type: String, required: true }, // 목록/슬라이드용 대표 이미지
  meta: String,         // 예: "캐주얼, 가벼운 산책" (리스트 페이지 설명)
  isOnSale: { type: Boolean, default: false }, // 세일 여부
  oldPrice: Number,     // 세일 전 원가
  discountText: String, // 예: "11%"
  badge: String,        // 예: "NEW", "BEST", "HOLIDAY COLLECTION"
  color: String,        // 슬라이드에서 보여줄 간단한 색상명 (예: "스토니 크림")
  sizes: [Number],      // 슬라이드/리스트에서 보여줄 사이즈 목록 [250, 260...]
  
  // --- ProductDetailPage.js 확장 필드 ---
  description: String,  // 상세 설명
  material: { type: String, required: true }, // 필수 (유칼립투스 등)
  category: String,     // men, women, new 등 필터링용
  
  // 상세페이지용 색상별 이미지 세트
  colors: [
    {
      code: String,       // 식별 코드 (black, grey)
      name: String,       // 화면 표시 이름 (내추럴 블랙)
      image: String,      // 해당 색상 메인 이미지
      thumb: String       // 해당 색상 썸네일
    }
  ],
  
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', ProductSchema);