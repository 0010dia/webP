const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });
const express = require("express");
const session = require("express-session");
const { MongoStore } = require("connect-mongo");
const cors = require("cors");
const connectDB = require("./config/database");

const app = express();
const PORT = process.env.PORT || 5001;

// MongoDB 연결
connectDB();

// CORS 설정
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

// 미들웨어 설정
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 정적 파일 제공
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));

// 세션 설정
const sessionConfig = {
  secret: process.env.SESSION_SECRET || "your-secret-key",
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};

if (process.env.USE_MONGO_SESSION === "true") {
  sessionConfig.store = new MongoStore({
    mongoUrl: process.env.MONGODB_URI,
    touchAfter: 24 * 3600,
  });
}

app.use(session(sessionConfig));

// --- API 라우터 불러오기 ---
const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/products");
const cartRoutes = require("./routes/cart");
const orderRoutes = require("./routes/orders"); // ✅ 여기 하나만 있어야 함
const adminRoutes = require("./routes/admin");
const reviewRoutes = require("./routes/reviews"); // ✅ 리뷰 라우터 추가

// --- API 엔드포인트 등록 ---
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/reviews", reviewRoutes);

// 헬스 체크
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Server is running" });
});

// 404 에러
app.use((req, res) => {
  res.status(404).json({ success: false, message: "API endpoint not found" });
});

// 서버 에러
app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(500)
    .json({ success: false, message: "서버 오류가 발생했습니다." });
});

app.listen(PORT, () => {
  console.log(`🚀 서버가 포트 ${PORT}에서 실행 중입니다.`);
  console.log(`📱 API: http://localhost:${PORT}/api`);
});
