const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { isLoggedIn } = require('../config/authMiddleware');

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
    const { productId, size, quantity, colorName, image } = req.body;
    console.log('장바구니 요청 데이터:', { productId, size, quantity, colorName, image });

    const mongoose = require('mongoose');
    if (!mongoose.Types.ObjectId.isValid(productId)) {
       return res.status(400).json({ success: false, message: '잘못된 상품 ID입니다.' });
    }


    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: '상품을 찾을 수 없습니다.'
      });
    }

    // 장바구니 초기화
    if (!req.session.cart) {
      req.session.cart = [];
    }

    // 동일한 상품, 동일한 사이즈, 동일한 색상이 이미 있는지 확인
    const existingItem = req.session.cart.find(
      item => item.productId === productId && item.size === Number(size) && item.colorName === colorName
    );

    if (existingItem) {
      existingItem.quantity += Number(quantity);
    } else {
      req.session.cart.push({
        productId,
        productName: product.name,
        size: Number(size),
        quantity: Number(quantity),
        price: product.price,
        image: image,
        colorName: colorName
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

// DELETE /api/cart/clear - 장바구니 비우기
router.delete('/clear', isLoggedIn, (req, res) => {
  try {
    req.session.cart = [];
    res.json({
      success: true,
      message: '장바구니가 비워졌습니다.',
      cart: []
    });
  } catch (error) {
    console.error('장바구니 비우기 오류:', error);
    res.status(500).json({
      success: false,
      message: '장바구니 비우기 중 오류 발생'
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
