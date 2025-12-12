const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Order = require('../models/Order');
const upload = require('../config/multer');

// 관리자 권한 체크 미들웨어
const isAdmin = (req, res, next) => {
  if (!req.session.user || req.session.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: '관리자 권한이 필요합니다.'
    });
  }
  next();
};

// GET /api/admin/products - 상품 관리 리스트
router.get('/products', isAdmin, async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      products
    });
  } catch (error) {
    console.error('상품 목록 조회 오류:', error);
    res.status(500).json({
      success: false,
      message: '상품 목록 조회 중 오류가 발생했습니다.'
    });
  }
});

// GET /api/admin/products/:id - 상품 상세 조회 (수정용)
router.get('/products/:id', isAdmin, async (req, res) => {
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
    console.error('상품 조회 오류:', error);
    res.status(500).json({
      success: false,
      message: '상품 조회 중 오류가 발생했습니다.'
    });
  }
});

// POST /api/admin/products - 상품 등록 (Req 13)
router.post('/products', isAdmin, upload.array('images', 10), async (req, res) => {
  try {
    const { name, description, category, material, price, discountRate, is_on_sale, sizes } = req.body;

    // 업로드된 이미지 경로 처리
    const images = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];

    // 사이즈 데이터 처리
    let sizesArray = [];
    if (sizes) {
      // sizes가 문자열이면 JSON 파싱, 배열이면 그대로 사용
      sizesArray = typeof sizes === 'string' ? JSON.parse(sizes) : sizes;
    }

    // 카테고리 처리 (문자열을 배열로 변환)
    const categoryArray = typeof category === 'string' ? category.split(',').map(c => c.trim()) : category;

    const product = new Product({
      name,
      description,
      category: categoryArray,
      material,
      price: Number(price),
      discountRate: Number(discountRate) || 0,
      is_on_sale: is_on_sale === 'true' || is_on_sale === true,
      images,
      sizes: sizesArray
    });

    await product.save();

    res.json({
      success: true,
      product,
      message: '상품이 등록되었습니다.'
    });
  } catch (error) {
    console.error('상품 등록 오류:', error);
    res.status(500).json({
      success: false,
      message: '상품 등록 중 오류가 발생했습니다.'
    });
  }
});

// PUT /api/admin/products/:id - 상품 수정
router.put('/products/:id', isAdmin, upload.array('images', 10), async (req, res) => {
  try {
    const { name, description, category, material, price, discountRate, is_on_sale } = req.body;

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: '상품을 찾을 수 없습니다.'
      });
    }

    // 새 이미지가 업로드되었으면 추가
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => `/uploads/${file.filename}`);
      product.images = [...product.images, ...newImages];
    }

    // 카테고리 처리
    const categoryArray = typeof category === 'string' ? category.split(',').map(c => c.trim()) : category;

    product.name = name;
    product.description = description;
    product.category = categoryArray;
    product.material = material;
    product.price = Number(price);
    product.discountRate = Number(discountRate) || 0;
    product.is_on_sale = is_on_sale === 'true' || is_on_sale === true;

    await product.save();

    res.json({
      success: true,
      product,
      message: '상품이 수정되었습니다.'
    });
  } catch (error) {
    console.error('상품 수정 오류:', error);
    res.status(500).json({
      success: false,
      message: '상품 수정 중 오류가 발생했습니다.'
    });
  }
});

// DELETE /api/admin/products/:id - 상품 삭제
router.delete('/products/:id', isAdmin, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({
      success: true,
      message: '상품이 삭제되었습니다.'
    });
  } catch (error) {
    console.error('상품 삭제 오류:', error);
    res.status(500).json({
      success: false,
      message: '상품 삭제 중 오류가 발생했습니다.'
    });
  }
});

// PATCH /api/admin/products/:id/sizes - 사이즈 가용성 토글 (Req 11)
router.patch('/products/:id/sizes', isAdmin, async (req, res) => {
  try {
    const { size } = req.body;

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: '상품을 찾을 수 없습니다.'
      });
    }

    // 해당 사이즈 찾기
    const sizeObj = product.sizes.find(s => s.size === Number(size));
    if (!sizeObj) {
      return res.status(404).json({
        success: false,
        message: '사이즈를 찾을 수 없습니다.'
      });
    }

    // available 상태 토글
    await Product.updateOne(
      { _id: req.params.id, 'sizes.size': Number(size) },
      { $set: { 'sizes.$.available': !sizeObj.available } }
    );

    res.json({
      success: true,
      available: !sizeObj.available,
      message: `사이즈 ${size}의 가용성이 변경되었습니다.`
    });
  } catch (error) {
    console.error('사이즈 변경 오류:', error);
    res.status(500).json({
      success: false,
      message: '사이즈 변경 중 오류가 발생했습니다.'
    });
  }
});

// PATCH /api/admin/products/:id/discount - 할인율 변경 (Req 12)
router.patch('/products/:id/discount', isAdmin, async (req, res) => {
  try {
    const { discountRate } = req.body;

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { discountRate: Number(discountRate) },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: '상품을 찾을 수 없습니다.'
      });
    }

    res.json({
      success: true,
      product,
      discountRate: product.discountRate,
      message: '할인율이 변경되었습니다.'
    });
  } catch (error) {
    console.error('할인율 변경 오류:', error);
    res.status(500).json({
      success: false,
      message: '할인율 변경 중 오류가 발생했습니다.'
    });
  }
});

// GET /api/admin/sales-report - 판매 현황 (Req 14)
router.get('/sales-report', isAdmin, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    // 날짜 필터 조건 설정
    let dateFilter = {};
    if (startDate && endDate) {
      dateFilter = {
        orderDate: {
          $gte: new Date(startDate),
          $lte: new Date(new Date(endDate).setHours(23, 59, 59, 999))
        }
      };
    }

    // Aggregation Pipeline으로 판매 데이터 집계
    const salesData = await Order.aggregate([
      { $match: dateFilter },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.productId',
          productName: { $first: '$items.productName' },
          totalQuantity: { $sum: '$items.quantity' },
          totalRevenue: { $sum: { $multiply: ['$items.quantity', '$items.priceAtPurchase'] } }
        }
      },
      { $sort: { totalRevenue: -1 } }
    ]);

    // 상품 정보 가져오기
    const productIds = salesData.map(item => item._id);
    const products = await Product.find({ _id: { $in: productIds } });

    // 상품 정보와 판매 데이터 결합
    const enrichedSalesData = salesData.map(sale => {
      const product = products.find(p => p._id.toString() === sale._id.toString());
      return {
        ...sale,
        product: product
      };
    });

    res.json({
      success: true,
      salesData: enrichedSalesData
    });
  } catch (error) {
    console.error('판매 현황 조회 오류:', error);
    res.status(500).json({
      success: false,
      message: '판매 현황 조회 중 오류가 발생했습니다.'
    });
  }
});

module.exports = router;
