const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { isLoggedIn } = require('../config/authMiddleware');

// 주문 생성 (결제)
router.post('/', isLoggedIn, async (req, res) => {
  try {
    const { items, totalAmount } = req.body;
    const userId = req.session.user.user_id; // 세션에서 userId 가져오기
    
    // 주문 저장
    const newOrder = new Order({
      userId,
      items,
      totalAmount
    });
    
    await newOrder.save();
    res.json({ success: true, orderId: newOrder._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: '주문 실패' });
  }
});

// 내 주문 내역 조회 (마이페이지용)
router.get('/', isLoggedIn, async (req, res) => {
  try {
    const userId = req.session.user.user_id; // 세션에서 userId 가져오기
    const orders = await Order.find({ userId }).sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
});

module.exports = router;