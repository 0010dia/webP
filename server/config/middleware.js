// 로그인 확인 미들웨어
const isAuthenticated = (req, res, next) => {
  if (req.session.user) {
    return next();
  }
  res.redirect('/auth/login');
};

// 관리자 권한 확인 미들웨어
const isAdmin = (req, res, next) => {
  if (req.session.user && req.session.user.role === 'admin') {
    return next();
  }
  res.status(403).send('접근 권한이 없습니다.');
};

// 고객 권한 확인 미들웨어
const isCustomer = (req, res, next) => {
  if (req.session.user && req.session.user.role === 'customer') {
    return next();
  }
  res.status(403).send('접근 권한이 없습니다.');
};

module.exports = {
  isAuthenticated,
  isAdmin,
  isCustomer
};
