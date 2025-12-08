const express = require('express');
const router = express.Router();
const User = require('../models/User');

// POST /api/auth/login - 로그인
router.post('/login', async (req, res) => {
  try {
    const { user_id, password } = req.body;

    // 사용자 찾기
    const user = await User.findOne({ user_id });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: '아이디 또는 비밀번호가 올바르지 않습니다.'
      });
    }

    // 비밀번호 확인
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: '아이디 또는 비밀번호가 올바르지 않습니다.'
      });
    }

    // 세션에 사용자 정보 저장
    req.session.user = {
      id: user._id,
      user_id: user.user_id,
      name: user.name,
      role: user.role
    };

    res.json({
      success: true,
      user: {
        id: user._id,
        user_id: user.user_id,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    console.error('로그인 오류:', error);
    res.status(500).json({
      success: false,
      message: '로그인 중 오류가 발생했습니다.'
    });
  }
});

// POST /api/auth/register - 회원가입
router.post('/register', async (req, res) => {
  try {
    const { user_id, password, name, role } = req.body;

    // 중복 확인
    const existingUser = await User.findOne({ user_id });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: '이미 존재하는 아이디입니다.'
      });
    }

    // 새 사용자 생성
    const user = new User({
      user_id,
      password,
      name,
      role: role || 'customer'
    });

    await user.save();

    res.json({
      success: true,
      message: '회원가입이 완료되었습니다.'
    });
  } catch (error) {
    console.error('회원가입 오류:', error);
    res.status(500).json({
      success: false,
      message: '회원가입 중 오류가 발생했습니다.'
    });
  }
});

// POST /api/auth/logout - 로그아웃
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('로그아웃 오류:', err);
      return res.status(500).json({
        success: false,
        message: '로그아웃 중 오류가 발생했습니다.'
      });
    }
    res.json({ success: true });
  });
});

// GET /api/auth/me - 현재 사용자 정보 조회
router.get('/me', (req, res) => {
  if (req.session.user) {
    res.json({
      success: true,
      user: req.session.user
    });
  } else {
    res.status(401).json({
      success: false,
      message: '로그인이 필요합니다.'
    });
  }
});

module.exports = router;
