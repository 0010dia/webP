const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// POST /api/orders - 주문 생성
router.post('/', async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({
        success: false,
        message: '로그인이 필요합니다.'
      });
    }

    const cart = req.session.cart || [];

    if (cart.length === 0) {
      return res.status(400).json({
        success: false,
        message: '장바구니가 비어 있습니다.'
      });
    }

    // 주문 항목 준비
    const items = cart.map(item => ({
      productId: item.productId,
      productName: item.productName,
      size: item.size,
      quantity: item.quantity,
      priceAtPurchase: item.price
    }));

    // 총 금액 계산
    const totalAmount = items.reduce((sum, item) => sum + (item.priceAtPurchase * item.quantity), 0);

    // 주문 생성
    const order = new Order({
      userId: req.session.user.id,
      items,
      totalAmount
    });

    await order.save();

    // 장바구니 비우기
    req.session.cart = [];

    res.json({
      success: true,
      order
    });
  } catch (error) {
    console.error('주문 처리 오류:', error);
    res.status(500).json({
      success: false,
      message: '주문 처리 중 오류가 발생했습니다.'
    });
  }
});

// GET /api/orders - 내 주문 내역 조회
router.get('/', async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({
        success: false,
        message: '로그인이 필요합니다.'
      });
    }

    const orders = await Order.find({ userId: req.session.user.id })
      .sort({ orderDate: -1 })
      .populate('items.productId');

    res.json({
      success: true,
      orders
    });
  } catch (error) {
    console.error('주문 내역 조회 오류:', error);
    res.status(500).json({
      success: false,
      message: '주문 내역 조회 중 오류가 발생했습니다.'
    });
  }
});

module.exports = router;
