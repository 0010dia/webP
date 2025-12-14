const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

// GET /api/products - 상품 리스트 조회 (필터링 포함)
router.get("/", async (req, res) => {
  try {
    const { category, material, sizes, sale, newProduct } = req.query;
    console.log("req.query =", req.query);

    const filter = {};

    // 카테고리 (AND)
    if (category) {
      filter.category = category;
    }

    // 소재 (OR)
    if (material) {
      const materialArr = material.split(",");
      filter.material = { $in: materialArr };
    }

    // 사이즈 (OR) + 재고 있는 것만
    if (sizes) {
      const sizeArr = sizes.split(",").map(Number);
      filter.sizes = {
        $elemMatch: {
          size: { $in: sizeArr },
          available: true,
        },
      };
    }

    // 세일
    if (sale === "true") {
      filter.is_on_sale = true;
    }

    // 신제품 (1달 이내)
    if (newProduct === "true") {
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      filter.createdAt = { $gte: oneMonthAgo };
    }

    const products = await Product.find(filter).sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      products,
    });
  } catch (error) {
    console.error("상품 리스트 조회 오류:", error);
    res.status(500).json({
      success: false,
      message: "상품 조회 중 오류가 발생했습니다.",
    });
  }
});

// GET /api/products/:id - 상품 상세 조회
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "상품을 찾을 수 없습니다.",
      });
    }

    res.json({
      success: true,
      product,
    });
  } catch (error) {
    console.error("상품 상세 조회 오류:", error);
    res.status(500).json({
      success: false,
      message: "상품 조회 중 오류가 발생했습니다.",
    });
  }
});

module.exports = router;
