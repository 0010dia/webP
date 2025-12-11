// server/seed.js
const mongoose = require('mongoose');
const Product = require('./models/Product'); // 경로 확인
require('dotenv').config();

// DB 연결
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/shop')
  .then(() => console.log("DB Connected"))
  .catch(err => console.log(err));

const seedData = {
  name: "남성 울 크루저 슬립온",
  price: 170000,
  description: "메리노 울과 리사이클 나일론을 블렌드한 어퍼로 유난히 편안합니다.",
  badge: "NEW",
  material: "메리노 울", 
  category: "men",
  colors: [
    { code: 'black', name: '내추럴 블랙', image: "/img/black_1.avif", thumb: "/img/black_1.avif" },
    { code: 'grey', name: '미스트 그레이', image: "/img/grey_1.avif", thumb: "/img/grey_1.avif" },
    { code: 'beige', name: '헤이지 베이지', image: "/img/3.avif", thumb: "/img/3.avif" },
    { code: 'navy', name: '트루 네이비', image: "/img/4.avif", thumb: "/img/4.avif" }
  ]
};

const seedDB = async () => {
  // 기존 데이터 비우기 (선택)
  await Product.deleteMany({});
  // 새 데이터 생성
  const product = await Product.create(seedData);
  console.log("------------------------------------------------");
  console.log("✅ 상품 등록 완료! 아래 ID를 복사하세요:");
  console.log(product._id.toString());  // ★ 이 ID가 중요합니다!
  console.log("------------------------------------------------");
  mongoose.connection.close();
};

seedDB();