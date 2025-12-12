const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// GET /api/products - 상품 리스트 조회 (필터링 포함)
router.get('/', async (req, res) => {
  try {
    const { category, material, sale, newProduct } = req.query;

    // 필터 조건 설정
    let filter = {};

    if (category) {
      filter.category = category;
    }

    if (material) {
      filter.material = material;
    }

    if (sale === 'true') {
      filter.is_on_sale = true;
    }

    // 신제품 필터 (1달 이내)
    if (newProduct === 'true') {
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      filter.createdAt = { $gte: oneMonthAgo };
    }

    const products = await Product.find(filter).sort({ createdAt: -1 });

    res.json({
      success: true,
      products
    });
  } catch (error) {
    console.error('상품 리스트 조회 오류:', error);
    res.status(500).json({
      success: false,
      message: '상품 조회 중 오류가 발생했습니다.'
    });
  }
});

// GET /api/products/:id - 상품 상세 조회
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: '상품을 찾을 수 없습니다.'
      });
    }

    res.json({
      success: true,
      product
    });
  } catch (error) {
    console.error('상품 상세 조회 오류:', error);
    res.status(500).json({
      success: false,
      message: '상품 조회 중 오류가 발생했습니다.'
    });
  }
});

module.exports = router;
