const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// GET /api/cart - 장바구니 조회
router.get('/', (req, res) => {
  try {
    const cart = req.session.cart || [];
    res.json({
      success: true,
      cart
    });
  } catch (error) {
    console.error('장바구니 조회 오류:', error);
    res.status(500).json({
      success: false,
      message: '장바구니 조회 중 오류가 발생했습니다.'
    });
  }
});

// POST /api/cart - 장바구니에 상품 추가
router.post('/', async (req, res) => {
  try {
    const { productId, size, quantity } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: '상품을 찾을 수 없습니다.'
      });
    }

    // 해당 사이즈가 구매 가능한지 확인
    const sizeObj = product.sizes.find(s => s.size === Number(size));
    if (!sizeObj || !sizeObj.available) {
      return res.status(400).json({
        success: false,
        message: '선택하신 사이즈는 구매할 수 없습니다.'
      });
    }

    // 장바구니 초기화
    if (!req.session.cart) {
      req.session.cart = [];
    }

    // 동일한 상품, 동일한 사이즈가 이미 있는지 확인
    const existingItem = req.session.cart.find(
      item => item.productId === productId && item.size === Number(size)
    );

    if (existingItem) {
      existingItem.quantity += Number(quantity);
    } else {
      req.session.cart.push({
        productId,
        productName: product.name,
        size: Number(size),
        quantity: Number(quantity),
        price: product.discountedPrice,
        image: product.images[0] || '/images/no-image.png'
      });
    }

    res.json({
      success: true,
      cart: req.session.cart,
      cartCount: req.session.cart.length
    });
  } catch (error) {
    console.error('장바구니 추가 오류:', error);
    res.status(500).json({
      success: false,
      message: '장바구니 추가 중 오류가 발생했습니다.'
    });
  }
});

// DELETE /api/cart/:index - 장바구니에서 상품 제거
router.delete('/:index', (req, res) => {
  try {
    const index = parseInt(req.params.index);

    if (req.session.cart && req.session.cart[index] !== undefined) {
      req.session.cart.splice(index, 1);
      res.json({
        success: true,
        cart: req.session.cart
      });
    } else {
      res.status(404).json({
        success: false,
        message: '항목을 찾을 수 없습니다.'
      });
    }
  } catch (error) {
    console.error('장바구니 제거 오류:', error);
    res.status(500).json({
      success: false,
      message: '장바구니 제거 중 오류가 발생했습니다.'
    });
  }
});

module.exports = router;
