# CLAUDE.md

This file provides guidance to Claude Code when working with the Allbirds clone e-commerce project.

## Project Overview

This is a full-stack shoe e-commerce web application (Allbirds clone) built with React and Express/MongoDB. The project implements a complete online shopping experience with customer and admin functionalities.

**Repository**: https://github.com/0010dia/webP

## Technology Stack

### Frontend (app/)
- **React 19.2.0**: UI library
- **React Router 6**: Client-side routing
- **styled-components 6.1.19**: CSS-in-JS styling
- **axios 1.13.2**: HTTP client for API calls
- **Context API**: Global state management (Auth, Cart)

### Backend (server/)
- **Express 5.2.1**: Web framework
- **MongoDB + Mongoose 9**: Database and ODM
- **express-session**: Session management
- **bcrypt 6.0.0**: Password hashing
- **Multer 2.0.2**: Image upload handling
- **CORS**: Cross-origin resource sharing

### Development Tools
- **nodemon**: Backend hot-reload
- **concurrently**: Run frontend and backend simultaneously
- **react-scripts**: React build tools

## Project Structure

```
webP/
├── app/                          # React Frontend
│   ├── src/
│   │   ├── components/          # Reusable UI components
│   │   │   ├── Header.js        # Navigation, search, cart
│   │   │   ├── Footer.js        # Site footer
│   │   │   ├── MainBanner.js    # Homepage hero section
│   │   │   ├── Slide.js         # Product carousel
│   │   │   ├── MaterialsSection.js
│   │   │   └── NewsLetterSection.js
│   │   ├── page/                # Page components
│   │   │   ├── MainPage.js      # Homepage
│   │   │   └── ListPage.js      # Product listing page
│   │   ├── api/                 # API client modules
│   │   │   ├── client.js        # Axios instance with defaults
│   │   │   ├── auth.js          # Authentication API
│   │   │   ├── products.js      # Product API
│   │   │   ├── cart.js          # Cart API
│   │   │   ├── orders.js        # Order API
│   │   │   └── admin.js         # Admin API
│   │   ├── context/             # React Context for global state
│   │   │   ├── AuthContext.js   # User authentication state
│   │   │   └── CartContext.js   # Shopping cart state
│   │   ├── hooks/               # Custom React hooks
│   │   ├── App.js               # Main app component with routing
│   │   ├── Main.js              # App wrapper
│   │   └── index.js             # Entry point
│   ├── public/                  # Static assets
│   └── package.json
│
├── server/                       # Express Backend (Pure API, no EJS)
│   ├── models/                  # MongoDB schemas
│   │   ├── User.js              # User model with bcrypt
│   │   ├── Product.js           # Product model with virtuals
│   │   └── Order.js             # Order model with refs
│   ├── routes/                  # API route handlers
│   │   ├── auth.js              # Login, register, logout, me
│   │   ├── products.js          # Product listing
│   │   ├── cart.js              # Cart management
│   │   ├── orders.js            # Order creation and history
│   │   └── admin.js             # Admin CRUD, sales reports
│   ├── config/                  # Configuration files
│   │   ├── database.js          # MongoDB connection
│   │   ├── middleware.js        # Auth middleware
│   │   └── multer.js            # File upload config
│   ├── public/uploads/          # Uploaded product images
│   ├── server.js                # Express app entry point
│   ├── .env                     # Environment variables
│   └── package.json
│
└── package.json                 # Root - runs frontend & backend concurrently
```

## Key Features Implemented

### Customer Features
- ✅ Homepage with banners, slides, materials section
- ✅ Product listing page with filters (category, material, sale, new)
- ✅ Shopping cart functionality (add, remove, view)
- ✅ User authentication (register, login, logout)
- ✅ Order creation and order history viewing

### Admin Features
- ✅ **Product Management**: Full CRUD operations on products
- ✅ **Image Upload**: Multi-image upload with Multer
- ✅ **Size Management**: Toggle size availability (stock management)
- ✅ **Discount Management**: Change discount rates per product
- ✅ **Sales Reports**: Aggregated sales data with date filtering

## Database Models

### User Schema
```javascript
{
  user_id: String (unique login ID),
  password: String (bcrypt hashed),
  name: String,
  role: 'customer' | 'admin',
  timestamps: true
}
```

### Product Schema
```javascript
{
  name: String,
  description: String,
  category: [String] (array),
  material: String ('wool', 'tree', etc.),
  price: Number,
  discountRate: Number (0-100),
  images: [String] (paths),
  createdAt: Date,
  is_on_sale: Boolean,
  sizes: [{ size: Number, available: Boolean }],
  // Virtual fields:
  discountedPrice: calculated,
  isNewProduct: calculated (within 1 month)
}
```

### Order Schema
```javascript
{
  userId: ObjectId (ref: User),
  items: [{
    productId: ObjectId (ref: Product),
    productName: String,
    size: Number,
    quantity: Number,
    priceAtPurchase: Number
  }],
  totalAmount: Number,
  orderDate: Date,
  timestamps: true
}
```

## API Endpoints

### Authentication (`/api/auth`)
- `POST /login` - User login
- `POST /register` - New user registration
- `POST /logout` - User logout
- `GET /me` - Get current user info

### Products (`/api/products`)
- `GET /` - List products with filters (category, material, sale, newProduct)
- `GET /:id` - Get product details

### Cart (`/api/cart`)
- `GET /` - Get cart items
- `POST /` - Add item to cart
- `DELETE /:index` - Remove item from cart

### Orders (`/api/orders`)
- `POST /` - Create new order
- `GET /` - Get user's order history

### Admin (`/api/admin`) - Requires admin role
- `GET /products` - Admin product list
- `POST /products` - Create new product (with image upload)
- `PUT /products/:id` - Update product
- `DELETE /products/:id` - Delete product
- `PATCH /products/:id/sizes` - Toggle size availability
- `PATCH /products/:id/discount` - Change discount rate
- `GET /sales-report` - Aggregated sales data (with date filters)

## Running the Project

### Development Mode (Recommended)
```bash
# Install all dependencies
npm run install-all

# Run frontend + backend concurrently
npm run dev
```
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api

### Individual Execution
```bash
# Frontend only
npm run client

# Backend only
npm run server
```

## Environment Configuration

**File**: `server/.env`
```env
MONGODB_URI=mongodb://localhost:27017/shoe_shop
PORT=5000
SESSION_SECRET=your-secret-key
USE_MONGO_SESSION=false  # Set to true if MongoDB is running
```

## Current Implementation Status

### Fully Implemented
1. **Backend API**: All routes functional (auth, products, cart, orders, admin)
2. **Database Models**: User, Product, Order schemas complete
3. **Authentication**: Session-based auth with bcrypt
4. **Admin Features**: CRUD, image upload, size management, discount management, sales reports
5. **Frontend Components**: Header, Footer, MainBanner, Slide, MaterialsSection, NewsLetterSection
6. **Frontend Pages**: MainPage (homepage), ListPage (product listing)
7. **API Client**: Axios modules for all backend endpoints
8. **State Management**: AuthContext, CartContext

### Partially Implemented / Hardcoded
- **ListPage.js**: Currently uses hardcoded product data instead of API calls
- **No UI for**: Product detail page, cart page, checkout page, login/register pages, admin dashboard

### Not Yet Implemented
- [ ] Product detail page UI
- [ ] Shopping cart page UI
- [ ] Checkout flow UI
- [ ] User login/register pages UI
- [ ] Admin dashboard UI
- [ ] My orders page UI
- [ ] API integration for ListPage (currently hardcoded)
- [ ] Actual MongoDB test data seeding

## Development Guidelines

### When Working on This Project

1. **Read Before Editing**: Always read existing files before making changes to understand patterns
2. **Consistent Styling**: Use styled-components for all React styling
3. **API Layer**: Use the existing API modules in `app/src/api/` for all backend calls
4. **State Management**: Use AuthContext for user state, CartContext for cart state
5. **Route Organization**: Follow existing patterns in `server/routes/`
6. **Model Usage**: Use mongoose models with proper validation and virtuals
7. **Error Handling**: Return consistent JSON responses `{success, message, data}`

### Code Patterns

**Frontend API Call Pattern**:
```javascript
import { getProducts } from '../api/products';

const fetchData = async () => {
  try {
    const data = await getProducts({ category: 'lifestyle' });
    // Handle data
  } catch (error) {
    console.error(error);
  }
};
```

**Backend Route Pattern**:
```javascript
router.get('/', async (req, res) => {
  try {
    // Logic here
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
```

### Common Tasks

**Adding a New Page**:
1. Create component in `app/src/page/`
2. Add route in `app/src/App.js`
3. Use existing API modules for data fetching
4. Use Context for global state (auth, cart)

**Adding a New API Endpoint**:
1. Add route handler in `server/routes/`
2. Register in `server/server.js`
3. Create API client function in `app/src/api/`
4. Use in React components

**Connecting ListPage to Real API**:
1. Import `getProducts` from `app/src/api/products.js`
2. Replace hardcoded data with API call in `useEffect`
3. Handle loading and error states

## Security Considerations

- Passwords are hashed with bcrypt (salt rounds: 10)
- Session-based authentication with secure cookies
- Admin routes protected with `requireAdmin` middleware
- CORS configured for localhost:3000 only
- Multer restricts file uploads to images only

## Notes

- **MongoDB Optional**: Can run without MongoDB using memory sessions (for development)
- **Image Uploads**: Stored in `server/public/uploads/`, accessible via `/uploads/` route
- **Session Storage**: Can use MongoDB (MongoStore) or memory (based on USE_MONGO_SESSION)
- **Virtual Fields**: Product model includes `discountedPrice` and `isNewProduct` virtual fields

## Next Steps / TODO

Based on the README.md:
- [ ] Connect ListPage to real API (remove hardcoded data)
- [ ] Create product detail page UI
- [ ] Create shopping cart page UI
- [ ] Create login/register pages UI
- [ ] Create admin dashboard UI
- [ ] Seed MongoDB with test product data
- [ ] Add order history page UI

## Git Workflow

**Current Branch**: main
**Recent Commits**:
- Merged route list and app.js setup
- Server initialization and settings
- Footer, header, main components

**For Creating PRs**:
- Base branch: main
- Use descriptive commit messages
- Test both frontend and backend before pushing
