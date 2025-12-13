const mongoose = require('mongoose');
const Product = require('../models/Product');
const User = require('../models/User');
const Order = require('../models/Order');
require('dotenv').config({ path: '../.env' });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://root:ViBDTGNTK1X41btJ@ehdrms.hj35kbl.mongodb.net/shoe_shop?retryWrites=true&w=majority&tls=true';

// 라이프스타일 상품 데이터 (10개 이상)
const lifestyleProducts = [
  {
    name: '남성 울 크루저 슬립온',
    description: '메리노 울을 사용한 편안한 슬립온. 가벼운 착화감과 따뜻함을 동시에.',
    category: ['lifestyle', 'slipon'],
    material: 'wool',
    price: 98000,
    discountRate: 10,
    is_on_sale: true,
    images: ['/uploads/shoe1-1.jpg', '/uploads/shoe1-2.jpg'],
    sizes: [
      { size: 250, available: true },
      { size: 255, available: true },
      { size: 260, available: true },
      { size: 265, available: false },
      { size: 270, available: true },
      { size: 275, available: true },
      { size: 280, available: true }
    ],
    salesCount: 0,
    recommendScore: 85
  },
  {
    name: '남성 트리 러너',
    description: '가벼운 유칼립투스 소재로 시원하고 통기성이 좋은 러닝화.',
    category: ['lifestyle'],
    material: 'tree',
    price: 119000,
    discountRate: 0,
    is_on_sale: false,
    images: ['/uploads/shoe2-1.jpg', '/uploads/shoe2-2.jpg'],
    sizes: [
      { size: 250, available: true },
      { size: 255, available: true },
      { size: 260, available: true },
      { size: 265, available: true },
      { size: 270, available: true },
      { size: 275, available: false },
      { size: 280, available: true },
      { size: 285, available: true }
    ],
    salesCount: 0,
    recommendScore: 92
  },
  {
    name: '남성 슈가 스니커즈',
    description: '사탕수수 소재를 활용한 친환경 스니커즈. 편안한 쿠셔닝.',
    category: ['lifestyle'],
    material: 'sugar',
    price: 109000,
    discountRate: 15,
    is_on_sale: true,
    images: ['/uploads/shoe3-1.jpg', '/uploads/shoe3-2.jpg'],
    sizes: [
      { size: 255, available: true },
      { size: 260, available: true },
      { size: 265, available: true },
      { size: 270, available: true },
      { size: 275, available: true },
      { size: 280, available: true }
    ],
    salesCount: 0,
    recommendScore: 88
  },
  {
    name: '남성 울 러너',
    description: '울 소재의 러닝화. 부드러운 착용감과 온도 조절 기능.',
    category: ['lifestyle'],
    material: 'wool',
    price: 128000,
    discountRate: 0,
    is_on_sale: false,
    images: ['/uploads/shoe4-1.jpg', '/uploads/shoe4-2.jpg'],
    sizes: [
      { size: 250, available: true },
      { size: 255, available: true },
      { size: 260, available: true },
      { size: 265, available: true },
      { size: 270, available: true },
      { size: 275, available: true },
      { size: 280, available: true },
      { size: 285, available: true }
    ],
    salesCount: 0,
    recommendScore: 87
  },
  {
    name: '남성 캔버스 파이퍼',
    description: '캔버스 소재의 클래식한 디자인. 데일리 착용에 최적.',
    category: ['lifestyle'],
    material: 'canvas',
    price: 78000,
    discountRate: 20,
    is_on_sale: true,
    images: ['/uploads/shoe5-1.jpg', '/uploads/shoe5-2.jpg'],
    sizes: [
      { size: 250, available: true },
      { size: 255, available: true },
      { size: 260, available: true },
      { size: 265, available: true },
      { size: 270, available: false },
      { size: 275, available: true },
      { size: 280, available: true }
    ],
    salesCount: 0,
    recommendScore: 95
  },
  {
    name: '남성 트리 대셔',
    description: '트리 소재로 만든 경량 스니커즈. 통기성이 뛰어남.',
    category: ['lifestyle'],
    material: 'tree',
    price: 98000,
    discountRate: 0,
    is_on_sale: false,
    images: ['/uploads/shoe6-1.jpg', '/uploads/shoe6-2.jpg'],
    sizes: [
      { size: 255, available: true },
      { size: 260, available: true },
      { size: 265, available: true },
      { size: 270, available: true },
      { size: 275, available: true },
      { size: 280, available: true },
      { size: 285, available: true }
    ],
    salesCount: 0,
    recommendScore: 82  },
  {
    name: '남성 울 플라이어',
    description: '울 소재의 플라이어. 편안한 착용감과 세련된 디자인.',
    category: ['lifestyle'],
    material: 'wool',
    price: 108000,
    discountRate: 10,
    is_on_sale: true,
    images: ['/uploads/shoe7-1.jpg', '/uploads/shoe7-2.jpg'],
    sizes: [
      { size: 250, available: true },
      { size: 255, available: true },
      { size: 260, available: true },
      { size: 265, available: true },
      { size: 270, available: true },
      { size: 275, available: true },
      { size: 280, available: false }
    ],
    salesCount: 0,
    recommendScore: 91  },
  {
    name: '남성 트리 스킵퍼',
    description: '트리 소재의 스킵퍼. 가볍고 시원한 착용감.',
    category: ['lifestyle'],
    material: 'tree',
    price: 89000,
    discountRate: 0,
    is_on_sale: false,
    images: ['/uploads/shoe8-1.jpg', '/uploads/shoe8-2.jpg'],
    sizes: [
      { size: 250, available: true },
      { size: 255, available: true },
      { size: 260, available: true },
      { size: 265, available: true },
      { size: 270, available: true },
      { size: 275, available: true }
    ],
    salesCount: 0,
    recommendScore: 89  },
  {
    name: '남성 슈가 브리즈',
    description: '슈가 소재의 브리즈. 친환경적이고 가벼운 신발.',
    category: ['lifestyle'],
    material: 'sugar',
    price: 99000,
    discountRate: 15,
    is_on_sale: true,
    images: ['/uploads/shoe9-1.jpg', '/uploads/shoe9-2.jpg'],
    sizes: [
      { size: 255, available: true },
      { size: 260, available: true },
      { size: 265, available: true },
      { size: 270, available: true },
      { size: 275, available: true },
      { size: 280, available: true }
    ],
    salesCount: 0,
    recommendScore: 84  },
  {
    name: '남성 캔버스 래퍼',
    description: '캔버스 소재의 래퍼. 클래식하고 편안한 디자인.',
    category: ['lifestyle'],
    material: 'canvas',
    price: 85000,
    discountRate: 0,
    is_on_sale: false,
    images: ['/uploads/shoe10-1.jpg', '/uploads/shoe10-2.jpg'],
    sizes: [
      { size: 250, available: true },
      { size: 255, available: true },
      { size: 260, available: true },
      { size: 265, available: true },
      { size: 270, available: true },
      { size: 275, available: true },
      { size: 280, available: true }
    ],
    salesCount: 0,
    recommendScore: 93  },
  {
    name: '남성 울 스트라이더',
    description: '울 소재의 스트라이더. 따뜻하고 스타일리시.',
    category: ['lifestyle'],
    material: 'wool',
    price: 115000,
    discountRate: 0,
    is_on_sale: false,
    images: ['/uploads/shoe11-1.jpg', '/uploads/shoe11-2.jpg'],
    sizes: [
      { size: 250, available: true },
      { size: 255, available: true },
      { size: 260, available: true },
      { size: 265, available: true },
      { size: 270, available: true },
      { size: 275, available: true },
      { size: 280, available: true }
    ]
  }
];

// 슬립온 상품 데이터 (10개 이상)
const sliponProducts = [
  {
    name: '남성 트리 라운저',
    description: '편안한 슬립온 스타일. 트리 소재로 가볍고 통기성이 좋음.',
    category: ['slipon'],
    material: 'tree',
    price: 78000,
    discountRate: 10,
    is_on_sale: true,
    images: ['/uploads/slipon1-1.jpg', '/uploads/slipon1-2.jpg'],
    sizes: [
      { size: 250, available: true },
      { size: 255, available: true },
      { size: 260, available: true },
      { size: 265, available: true },
      { size: 270, available: true },
      { size: 275, available: false }
    ],
    salesCount: 0,
    recommendScore: 86  },
  {
    name: '남성 울 라운저',
    description: '울 소재의 라운저. 따뜻하고 편안한 실내외 겸용 슬립온.',
    category: ['slipon'],
    material: 'wool',
    price: 88000,
    discountRate: 0,
    is_on_sale: false,
    images: ['/uploads/slipon2-1.jpg', '/uploads/slipon2-2.jpg'],
    sizes: [
      { size: 250, available: true },
      { size: 255, available: true },
      { size: 260, available: true },
      { size: 265, available: true },
      { size: 270, available: true },
      { size: 275, available: true },
      { size: 280, available: true }
    ],
    salesCount: 0,
    recommendScore: 88  },
  {
    name: '남성 슈가 슬리퍼',
    description: '슈가 소재의 슬리퍼. 친환경적이고 가벼운 착용감.',
    category: ['slipon'],
    material: 'sugar',
    price: 68000,
    discountRate: 20,
    is_on_sale: true,
    images: ['/uploads/slipon3-1.jpg', '/uploads/slipon3-2.jpg'],
    sizes: [
      { size: 255, available: true },
      { size: 260, available: true },
      { size: 265, available: true },
      { size: 270, available: true },
      { size: 275, available: true }
    ],
    salesCount: 0,
    recommendScore: 94  },
  {
    name: '남성 캔버스 슬립온',
    description: '캔버스 소재의 클래식 슬립온. 데일리 착용에 완벽.',
    category: ['slipon'],
    material: 'canvas',
    price: 58000,
    discountRate: 0,
    is_on_sale: false,
    images: ['/uploads/slipon4-1.jpg', '/uploads/slipon4-2.jpg'],
    sizes: [
      { size: 250, available: true },
      { size: 255, available: true },
      { size: 260, available: true },
      { size: 265, available: true },
      { size: 270, available: true },
      { size: 275, available: true }
    ],
    salesCount: 0,
    recommendScore: 83  },
  {
    name: '남성 트리 이지',
    description: '트리 소재의 이지 슬립온. 가볍고 편안.',
    category: ['slipon'],
    material: 'tree',
    price: 75000,
    discountRate: 15,
    is_on_sale: true,
    images: ['/uploads/slipon5-1.jpg', '/uploads/slipon5-2.jpg'],
    sizes: [
      { size: 250, available: true },
      { size: 255, available: true },
      { size: 260, available: true },
      { size: 265, available: true },
      { size: 270, available: true },
      { size: 275, available: true },
      { size: 280, available: true }
    ],
    salesCount: 0,
    recommendScore: 92  },
  {
    name: '남성 울 코지',
    description: '울 소재의 코지 슬립온. 따뜻하고 포근한 착용감.',
    category: ['slipon'],
    material: 'wool',
    price: 82000,
    discountRate: 0,
    is_on_sale: false,
    images: ['/uploads/slipon6-1.jpg', '/uploads/slipon6-2.jpg'],
    sizes: [
      { size: 255, available: true },
      { size: 260, available: true },
      { size: 265, available: true },
      { size: 270, available: true },
      { size: 275, available: true },
      { size: 280, available: false }
    ],
    salesCount: 0,
    recommendScore: 85  },
  {
    name: '남성 슈가 컴포트',
    description: '슈가 소재의 컴포트 슬립온. 친환경 소재로 편안함.',
    category: ['slipon'],
    material: 'sugar',
    price: 72000,
    discountRate: 10,
    is_on_sale: true,
    images: ['/uploads/slipon7-1.jpg', '/uploads/slipon7-2.jpg'],
    sizes: [
      { size: 250, available: true },
      { size: 255, available: true },
      { size: 260, available: true },
      { size: 265, available: true },
      { size: 270, available: true }
    ],
    salesCount: 0,
    recommendScore: 87  },
  {
    name: '남성 캔버스 릴렉스',
    description: '캔버스 소재의 릴렉스 슬립온. 편안한 일상화.',
    category: ['slipon'],
    material: 'canvas',
    price: 62000,
    discountRate: 0,
    is_on_sale: false,
    images: ['/uploads/slipon8-1.jpg', '/uploads/slipon8-2.jpg'],
    sizes: [
      { size: 250, available: true },
      { size: 255, available: true },
      { size: 260, available: true },
      { size: 265, available: true },
      { size: 270, available: true },
      { size: 275, available: true }
    ],
    salesCount: 0,
    recommendScore: 91  },
  {
    name: '남성 트리 브리즈',
    description: '트리 소재의 브리즈 슬립온. 통기성 좋고 가벼움.',
    category: ['slipon'],
    material: 'tree',
    price: 79000,
    discountRate: 0,
    is_on_sale: false,
    images: ['/uploads/slipon9-1.jpg', '/uploads/slipon9-2.jpg'],
    sizes: [
      { size: 255, available: true },
      { size: 260, available: true },
      { size: 265, available: true },
      { size: 270, available: true },
      { size: 275, available: true },
      { size: 280, available: true }
    ],
    salesCount: 0,
    recommendScore: 89  },
  {
    name: '남성 울 플러시',
    description: '울 소재의 플러시 슬립온. 따뜻하고 포근한 느낌.',
    category: ['slipon'],
    material: 'wool',
    price: 86000,
    discountRate: 15,
    is_on_sale: true,
    images: ['/uploads/slipon10-1.jpg', '/uploads/slipon10-2.jpg'],
    sizes: [
      { size: 250, available: true },
      { size: 255, available: true },
      { size: 260, available: true },
      { size: 265, available: true },
      { size: 270, available: true },
      { size: 275, available: true }
    ],
    salesCount: 0,
    recommendScore: 86  },
  {
    name: '남성 슈가 소프트',
    description: '슈가 소재의 소프트 슬립온. 부드러운 착용감.',
    category: ['slipon'],
    material: 'sugar',
    price: 70000,
    discountRate: 0,
    is_on_sale: false,
    images: ['/uploads/slipon11-1.jpg', '/uploads/slipon11-2.jpg'],
    sizes: [
      { size: 250, available: true },
      { size: 255, available: true },
      { size: 260, available: true },
      { size: 265, available: true },
      { size: 270, available: true },
      { size: 275, available: true },
      { size: 280, available: true }
    ],
    salesCount: 0,
    recommendScore: 90
  }
];

async function seedDatabase() {
  try {
    // MongoDB 연결
    console.log('MongoDB 연결 중...');
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB 연결 성공!');

    // 기존 데이터 삭제 (선택사항)
    console.log('\n기존 데이터 삭제 중...');
    await Product.deleteMany({});
    await User.deleteMany({});
    await Order.deleteMany({});
    console.log('기존 데이터 삭제 완료');

    // 사용자 계정 생성
    console.log('\n사용자 계정 생성 중...');

    const adminUser = new User({
      user_id: 'admin',
      password: 'admin1234',
      name: '관리자',
      role: 'admin'
    });
    await adminUser.save();
    console.log('관리자 계정 생성 완료 (ID: admin, PW: admin1234)');

    const customerUser = new User({
      user_id: 'customer',
      password: 'customer1234',
      name: '고객',
      role: 'customer'
    });
    await customerUser.save();
    console.log('고객 계정 생성 완료 (ID: customer, PW: customer1234)');

    // 상품 데이터 삽입
    console.log('\n라이프스타일 상품 삽입 중...');
    const insertedLifestyle = await Product.insertMany(lifestyleProducts);
    console.log(`라이프스타일 상품 ${insertedLifestyle.length}개 삽입 완료`);

    console.log('\n슬립온 상품 삽입 중...');
    const insertedSlipon = await Product.insertMany(sliponProducts);
    console.log(`슬립온 상품 ${insertedSlipon.length}개 삽입 완료`);

    // 샘플 주문 데이터 생성 (판매 현황 테스트용)
    console.log('\n샘플 주문 데이터 생성 중...');
    const allProducts = [...insertedLifestyle, ...insertedSlipon];

    // 과거 주문 데이터 (판매 현황 테스트용)
    const sampleOrders = [
      {
        userId: customerUser._id,
        items: [
          {
            productId: allProducts[0]._id,
            productName: allProducts[0].name,
            size: 260,
            quantity: 2,
            priceAtPurchase: allProducts[0].price * (1 - allProducts[0].discountRate / 100)
          }
        ],
        totalAmount: allProducts[0].price * (1 - allProducts[0].discountRate / 100) * 2,
        orderDate: new Date('2024-11-01')
      },
      {
        userId: customerUser._id,
        items: [
          {
            productId: allProducts[1]._id,
            productName: allProducts[1].name,
            size: 270,
            quantity: 1,
            priceAtPurchase: allProducts[1].price
          },
          {
            productId: allProducts[10]._id,
            productName: allProducts[10].name,
            size: 265,
            quantity: 1,
            priceAtPurchase: allProducts[10].price
          }
        ],
        totalAmount: allProducts[1].price + allProducts[10].price,
        orderDate: new Date('2024-11-15')
      },
      {
        userId: customerUser._id,
        items: [
          {
            productId: allProducts[2]._id,
            productName: allProducts[2].name,
            size: 265,
            quantity: 3,
            priceAtPurchase: allProducts[2].price * (1 - allProducts[2].discountRate / 100)
          }
        ],
        totalAmount: allProducts[2].price * (1 - allProducts[2].discountRate / 100) * 3,
        orderDate: new Date('2024-12-01')
      },
      {
        userId: customerUser._id,
        items: [
          {
            productId: allProducts[12]._id,
            productName: allProducts[12].name,
            size: 270,
            quantity: 2,
            priceAtPurchase: allProducts[12].price * (1 - allProducts[12].discountRate / 100)
          }
        ],
        totalAmount: allProducts[12].price * (1 - allProducts[12].discountRate / 100) * 2,
        orderDate: new Date('2024-12-10')
      }
    ];

    await Order.insertMany(sampleOrders);
    console.log(`샘플 주문 ${sampleOrders.length}개 생성 완료`);

    // 샘플 주문에 따라 salesCount 업데이트
    console.log('\n판매량 업데이트 중...');
    for (const order of sampleOrders) {
      for (const item of order.items) {
        await Product.findByIdAndUpdate(
          item.productId,
          { $inc: { salesCount: item.quantity } }
        );
      }
    }
    console.log('판매량 업데이트 완료');

    console.log('\n=== 데이터베이스 시딩 완료! ===');
    console.log(`총 상품 수: ${insertedLifestyle.length + insertedSlipon.length}개`);
    console.log(`- 라이프스타일: ${insertedLifestyle.length}개`);
    console.log(`- 슬립온: ${insertedSlipon.length}개`);
    console.log(`샘플 주문: ${sampleOrders.length}개`);
    console.log('\n계정 정보:');
    console.log('- 관리자: admin / admin1234');
    console.log('- 고객: customer / customer1234');
    console.log('\n주의: 실제 이미지 파일은 server/public/uploads 폴더에 수동으로 추가해야 합니다.');

  } catch (error) {
    console.error('데이터 시딩 중 오류 발생:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\nMongoDB 연결 종료');
  }
}

// 스크립트 실행
seedDatabase();
