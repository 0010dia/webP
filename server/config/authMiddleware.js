// server/config/authMiddleware.js
const isLoggedIn = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.status(401).json({ success: false, message: '로그인이 필요합니다.' });
  }
};

module.exports = { isLoggedIn };
