const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB 연결 성공');
  } catch (error) {
    console.error('MongoDB 연결 실패:', error.message);
    console.warn('⚠️  MongoDB 없이 계속 진행합니다. 일부 기능이 작동하지 않을 수 있습니다.');
    // 개발 중에는 종료하지 않고 계속 진행
    // process.exit(1);
  }
};

module.exports = connectDB;
