const mongoose = require('mongoose');
const Product = require('./models/Product');
const User = require('./models/User');
require('dotenv').config({ path: __dirname + '/.env' });

// DB 연결
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/shop')
  .then(() => console.log("DB Connected"))
  .catch(err => console.log(err));

// 🟢 리스트 페이지와 상세 페이지 모두 만족하는 완전한 데이터
const seedData = {
  // 1. 기본 정보
  name: "남성 울 크루저 슬립온",
  price: 98000,
  
  // 2. ListPage.js & Slide.js 호환용 데이터
  images: ["/uploads/shoe1-1.jpg", "/uploads/shoe1-2.jpg"], // Changed to images array
  meta: "가볍고 시원한 착화감, 데일리 슬립온",
  is_on_sale: true, // Updated to is_on_sale and true
  badge: "NEW",    // 뱃지
 (kept for now, will remove later if explicitly requested)
  sizes: [250, 255, 260, 265, 270, 275, 280], // 구매 가능 사이즈
  
  // 3. 상세 페이지 및 필터링용 데이터
  description: "메리노 울을 사용한 편안한 슬립온. 가벼운 착화감과 따뜻함을 동시에.",
  material: "wool",
  category: ["lifestyle", "slipon"], // Changed to array
  discountRate: 10, // Added discountRate
  
  // 4. 상세 페이지 슬라이더용 색상 정보 (Removed colors array)
};

const seedDB = async () => {
  try {
    // 1. 유저 시딩
    await User.deleteMany({}); // 기존 유저 삭제
    const testUser = await User.create({
      user_id: 'testuser',
      password: 'password123',
      name: '테스트유저'
    });
    console.log("------------------------------------------------");
    console.log("✅ 테스트 유저 생성 완료!");
    console.log("   ID: testuser");
    console.log("   Password: password123");
    console.log("------------------------------------------------");


    // 2. 제품 시딩
    // 기존 데이터 삭제 (중복 방지)
    await Product.deleteMany({});
    
    // 데이터 생성
    const product = await Product.create(seedData);
    
    console.log("------------------------------------------------");
    console.log("✅ 모든 필드가 포함된 데이터 등록 완료!");
    console.log("👇 아래 ID를 복사해서 브라우저 주소창에 넣으세요:");
    console.log(product._id.toString()); 
    console.log("------------------------------------------------");
  } catch (e) {
    console.error("데이터 넣기 실패:", e);
  } finally {
    mongoose.connection.close();
  }
};

seedDB();