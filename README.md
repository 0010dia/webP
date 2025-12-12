# 올버즈 클론 - 신발 쇼핑몰 풀스택 프로젝트

React + Express 기반의 신발 쇼핑몰 웹 애플리케이션입니다.

## 📁 프로젝트 구조

```
webP/
├── app/                # React 프론트엔드
│   ├── src/
│   │   ├── components/ # 재사용 가능한 UI 컴포넌트
│   │   ├── page/       # 페이지 컴포넌트
│   │   ├── api/        # API 통신 레이어
│   │   └── context/    # 전역 상태 관리 (Auth, Cart)
│   └── public/
│
├── server/             # Express 백엔드 (EJS 없이 순수 API)
│   ├── models/         # MongoDB 스키마
│   ├── routes/         # API 라우터
│   ├── config/         # 설정 파일 (DB, Multer)
│   ├── public/uploads/ # 업로드된 이미지
│   └── server.js       # Express 서버 메인
│
└── package.json        # 루트 - 프론트/백 동시 실행
```

## 🛠 기술 스택

### 프론트엔드
- **React 19.2.0**: UI 라이브러리
- **React Router 6**: 클라이언트 사이드 라우팅
- **styled-components**: CSS-in-JS 스타일링
- **axios**: HTTP 클라이언트
- **Context API**: 전역 상태 관리 (Auth, Cart)

### 백엔드
- **Express 5.2.1**: 웹 프레임워크
- **MongoDB + Mongoose 9**: 데이터베이스
- **express-session**: 세션 관리
- **bcrypt**: 비밀번호 암호화
- **Multer**: 이미지 업로드
- **CORS**: 크로스 오리진 요청 허용

## 🚀 설치 및 실행

### 1. 의존성 설치

**옵션 A: 전체 설치 (권장)**
```bash
npm run install-all
```

**옵션 B: 개별 설치**
```bash
# 루트
npm install

# 프론트엔드
cd app && npm install

# 백엔드
cd server && npm install
```

### 2. 환경 변수 설정

`server/.env` 파일을 확인하고 필요시 수정:
```env
MONGODB_URI=mongodb://localhost:27017/shoe_shop
PORT=5000
SESSION_SECRET=your-secret-key
USE_MONGO_SESSION=false  # MongoDB 실행 시 true로 변경
```

### 3. MongoDB 실행 (선택사항)

MongoDB가 설치되어 있다면:
```bash
# macOS
brew services start mongodb-community

# 또는
mongod --dbpath ~/data/db
```

**Note**: MongoDB 없이도 개발 가능합니다 (메모리 세션 사용)

### 4. 서버 실행

**옵션 A: 프론트엔드 + 백엔드 동시 실행 (권장)**
```bash
npm run dev
```
- 프론트엔드: `http://localhost:3000`
- 백엔드 API: `http://localhost:5000/api`

**옵션 B: 개별 실행**
```bash
# 백엔드만 (터미널 1)
npm run server

# 프론트엔드만 (터미널 2)
npm run client
```

## 📡 API 엔드포인트

### 인증 API
- `POST /api/auth/login` - 로그인
- `POST /api/auth/register` - 회원가입
- `POST /api/auth/logout` - 로그아웃
- `GET /api/auth/me` - 현재 사용자 정보

### 상품 API
- `GET /api/products` - 상품 리스트 (필터링)
  - Query: `?category=lifestyle&material=wool&sale=true&newProduct=true`
- `GET /api/products/:id` - 상품 상세

### 장바구니 API
- `GET /api/cart` - 장바구니 조회
- `POST /api/cart` - 장바구니에 상품 추가
- `DELETE /api/cart/:index` - 장바구니에서 제거

### 주문 API
- `POST /api/orders` - 주문 생성
- `GET /api/orders` - 내 주문 내역

### 관리자 API (로그인 + 관리자 권한 필요)
- `GET /api/admin/products` - 상품 관리 리스트
- `POST /api/admin/products` - 상품 등록
- `PUT /api/admin/products/:id` - 상품 수정
- `DELETE /api/admin/products/:id` - 상품 삭제
- `PATCH /api/admin/products/:id/sizes` - 사이즈 가용성 토글
- `PATCH /api/admin/products/:id/discount` - 할인율 변경
- `GET /api/admin/sales-report` - 판매 현황

## 📦 주요 기능

### 고객 기능
- ✅ 상품 리스트 조회 (카테고리, 소재, 세일, 신제품 필터)
- ✅ 상품 상세 조회
- ✅ 사이즈 선택 및 장바구니 담기
- ✅ 주문하기
- ✅ 주문 내역 조회
- ✅ 로그인/회원가입

### 관리자 기능
- ✅ **[Req 11]** 가용 사이즈 변경 (재고 관리)
- ✅ **[Req 12]** 할인 정책 변경
- ✅ **[Req 13]** 상품 등록 (이미지 업로드 포함)
- ✅ **[Req 14]** 판매 현황 (Aggregation, 날짜 필터링)

## 🎨 UI/UX 특징

- 세련된 올버즈 스타일의 디자인
- 반응형 레이아웃
- 부드러운 사용자 경험
- 직관적인 필터링 UI
- 실시간 장바구니 업데이트

## 🔧 개발 스크립트

```json
{
  "dev": "프론트엔드 + 백엔드 동시 실행",
  "client": "프론트엔드만 실행",
  "server": "백엔드만 실행",
  "install-all": "모든 의존성 설치"
}
```

## 📚 MongoDB 스키마

### User (사용자)
- `user_id`: String (로그인 ID)
- `password`: String (암호화)
- `name`: String
- `role`: 'customer' | 'admin'

### Product (상품)
- `name`: String (상품명)
- `description`: String
- `category`: [String] (배열)
- `material`: String ('wool', 'tree', etc.)
- `price`: Number
- `discountRate`: Number (0-100)
- `images`: [String] (이미지 경로 배열)
- `createdAt`: Date
- `is_on_sale`: Boolean
- `sizes`: [{ size: Number, available: Boolean }]

### Order (주문)
- `userId`: ObjectId (User 참조)
- `items`: [{ productId, productName, size, quantity, priceAtPurchase }]
- `totalAmount`: Number
- `orderDate`: Date

## 🐛 문제 해결

### MongoDB 연결 오류
- MongoDB가 실행 중인지 확인
- `.env`의 `MONGODB_URI` 확인
- MongoDB 없이도 개발 가능 (메모리 세션)

### 포트 충돌
- 프론트엔드: 3000 포트
- 백엔드: 5000 포트
- 포트가 사용 중이면 `.env` 또는 `app/package.json` 수정

### CORS 오류
- `server/server.js`의 CORS 설정 확인
- 프론트엔드 URL이 `http://localhost:3000`인지 확인

## 📝 다음 단계

- [ ] MongoDB 연결 및 테스트 데이터 생성
- [ ] ListPage API 연동 (하드코딩 → 실제 API)
- [ ] 새 페이지 추가 (상품 상세, 장바구니, 로그인 등)
- [ ] 관리자 페이지 UI 개발

## 📄 라이선스

ISC
