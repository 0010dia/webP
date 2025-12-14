const express = require('express');
const router = express.Router();
const Review = require('../models/Review');

// POST /api/reviews - 리뷰 작성
router.post('/', async (req, res) => {
  try {
    const { productId, rating, content } = req.body;
    
    // 세션에서 사용자 정보 확인
    if (!req.session.user) {
      return res.status(401).json({ success: false, message: '로그인이 필요합니다.' });
    }

    const review = new Review({
      productId,
      userId: req.session.user.id,
      userName: req.session.user.name || '사용자',
      rating,
      content
    });

    await review.save();
    res.json({ success: true, message: '후기가 등록되었습니다.' });
  } catch (error) {
    console.error('리뷰 등록 오류:', error);
    res.status(500).json({ success: false, message: '서버 오류' });
  }
});

// GET /api/reviews/:productId - 특정 상품의 리뷰 조회
router.get('/:productId', async (req, res) => {
  try {
    const reviews = await Review.find({ productId: req.params.productId })
      .sort({ createdAt: -1 }); // 최신순
    res.json({ success: true, reviews });
  } catch (error) {
    console.error('리뷰 조회 오류:', error);
    res.status(500).json({ success: false, message: '서버 오류' });
  }
});

module.exports = router;