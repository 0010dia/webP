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
  name: "남성 트리 러너 NZ",
  price: 170000,
  
  // 2. ListPage.js & Slide.js 호환용 데이터
  image: "/img/black_4.avif", // 대표 이미지
  meta: "가볍고 시원한 착화감, 데일리 스니커즈", // 리스트에 뜰 설명
  isOnSale: false, // 세일 아님
  badge: "NEW",    // 뱃지
  color: "내추럴 블랙", // 슬라이드용 색상명
  sizes: [250, 255, 260, 265, 270, 275, 280], // 구매 가능 사이즈
  
  // 3. 상세 페이지 및 필터링용 데이터
  description: "최상의 편안함을 위해 세심하게 만들어진 트리 러너 NZ는 메모리폼 풋베드로 다양한 발 형태에도 유연하게 대응해, 누구에게나 안정적인 착화감을 제공합니다.",
  material: "유칼립투스 트리",
  category: "men", // 남성 카테고리
  
  // 4. 상세 페이지 슬라이더용 색상 정보
  colors: [
    { 
      code: 'black', 
      name: '내추럴 블랙 (Natural Black)', 
      image: "/img/black_4.avif", 
      thumb: "/img/black_4.avif" 
    },
    { 
      code: 'grey', 
      name: '미스트 그레이 (Mist Grey)', 
      image: "/img/grey_4.avif", 
      thumb: "/img/grey_4.avif" 
    },
    { 
      code: 'beige', 
      name: '헤이지 베이지 (Hazy Beige)', 
      image: "/img/4.avif", 
      thumb: "/img/4.avif" 
    },
    { 
      code: 'navy', 
      name: '트루 네이비 (True Navy)', 
      image: "/img/navy_4.avif", 
      thumb: "/img/navy_4.avif" 
    }
  ]
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