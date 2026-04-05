# ShopG — Node.js + React + MongoDB Conversion

> College project: PHP/MySQL → Express.js + React + MongoDB + JWT

---

## Tech Stack Comparison

| Layer        | Before (PHP)          | After (Node.js)              |
|--------------|-----------------------|------------------------------|
| Backend      | PHP + Apache          | Express.js (Node.js)         |
| Database     | MySQL                 | MongoDB (Mongoose)           |
| Auth         | PHP `$_SESSION`       | JWT (JSON Web Tokens)        |
| Frontend     | Static HTML + CSS     | React (SPA)                  |
| Cart Storage | PHP Session variables | MongoDB (per-user, persists) |
| Passwords    | Plaintext ⚠️          | bcrypt hashed ✅              |

---

## Project Structure

```
shopg-backend/
├── server.js               ← Express app entry point
├── .env.example            ← Environment variable template
├── package.json
│
├── models/
│   ├── User.js             ← User schema (username, hashed password, cart[])
│   └── Product.js          ← Product schema (name, price, category, image)
│
├── routes/
│   ├── auth.js             ← POST /register, POST /login, GET /me
│   ├── cart.js             ← GET / | POST /add | PATCH /quantity | DELETE /remove | DELETE /clear
│   └── products.js         ← GET / | GET /:id | POST /seed
│
├── middleware/
│   └── auth.js             ← JWT protect middleware
│
└── ShopG.jsx               ← Complete React frontend (single file)
```

---

## API Endpoints

### Auth
| Method | Endpoint              | Body                       | Auth | Description       |
|--------|-----------------------|----------------------------|------|-------------------|
| POST   | `/api/auth/register`  | `{ username, password }`   | No   | Create account    |
| POST   | `/api/auth/login`     | `{ username, password }`   | No   | Login, get JWT    |
| GET    | `/api/auth/me`        | —                          | Yes  | Get current user  |

### Cart (all require JWT)
| Method | Endpoint              | Body                                          | Description      |
|--------|-----------------------|-----------------------------------------------|------------------|
| GET    | `/api/cart`           | —                                             | Get cart + total |
| POST   | `/api/cart/add`       | `{ item_name, item_price, quantity, category }` | Add item       |
| PATCH  | `/api/cart/quantity`  | `{ item_name, quantity }`                     | Update quantity  |
| DELETE | `/api/cart/remove`    | `{ item_name }`                               | Remove item      |
| DELETE | `/api/cart/clear`     | —                                             | Empty cart       |

### Products
| Method | Endpoint              | Query         | Description              |
|--------|-----------------------|---------------|--------------------------|
| GET    | `/api/products`       | `?category=`  | All products / by category |
| GET    | `/api/products/:id`   | —             | Single product           |
| POST   | `/api/products/seed`  | —             | Seed DB with all products|

---

## Setup Instructions

### 1. Prerequisites
- Node.js v18+
- MongoDB running locally (`mongod`) OR MongoDB Atlas URI

### 2. Backend Setup
```bash
cd shopg-backend
npm install

# Copy and edit env file
cp .env.example .env
# Edit .env: set MONGO_URI and JWT_SECRET

npm run dev   # starts on http://localhost:5000
```

### 3. Seed the Database
```bash
# After server is running:
curl -X POST http://localhost:5000/api/products/seed
# Seeds all 55+ products from original ShopG pages
```

### 4. Frontend Setup
```bash
# Create React app
npx create-react-app shopg-frontend
cd shopg-frontend

# Copy ShopG.jsx → src/App.jsx
# Install nothing extra — uses built-in React hooks only

npm start   # runs on http://localhost:3000
```

---

## Security Improvements (vs Original PHP)

### 1. SQL Injection → No SQL
Original PHP:
```php
// DANGEROUS: raw $_POST in query
$query = "SELECT * FROM login_info WHERE username='$username'";
```

Node.js with Mongoose:
```javascript
// SAFE: parameterised, no raw SQL
const user = await User.findOne({ username });
```

### 2. Plaintext Passwords → bcrypt
Original PHP:
```php
// Passwords stored and compared as plain text
if ($username == $r['username'] && $pwd == $r['password'])
```

Node.js:
```javascript
// bcrypt hashes password before storing
userSchema.pre('save', async function () {
  this.password = await bcrypt.hash(this.password, 10);
});
// Secure comparison
await bcrypt.compare(enteredPassword, this.password)
```

### 3. Session Hijacking → JWT
Original PHP:
```php
// Session stored server-side, tied to cookie
$_SESSION['cart'][$count] = array(...);
```

Node.js:
```javascript
// Stateless JWT — signed, expirable, not stored server-side
const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
// Frontend stores in localStorage, sends as: Authorization: Bearer <token>
```

### 4. Cart Persistence
| Feature         | PHP Sessions      | MongoDB Cart         |
|-----------------|-------------------|----------------------|
| Persists logout | No               | Yes                  |
| Multi-device    | No               | Yes                  |
| Stored where    | Server RAM/files  | Database (per user)  |

---

## PHP → Node.js Code Mapping

| PHP File      | Node.js Equivalent        |
|---------------|---------------------------|
| `login.php`   | `routes/auth.js` (login)  |
| `form.php`    | `routes/auth.js` (register)|
| `cart.php`    | `routes/cart.js` (add/remove)|
| `cart2.php`   | React `CartPage` component|
| `queries.sql` | `models/Product.js` schema|

---

## React Frontend Features

- **Single Page Application** — no page reloads, state-based routing
- **Auth Context** — JWT stored in localStorage, auto-verified on load
- **Cart Context** — real-time cart sync with backend
- **All 5 categories** — Grocery, Spices, Personal Care, Baby Care, Beauty
- **Live validation** — username/password regex validation on input
- **Toast notifications** — add to cart, errors, success feedback
- **Responsive design** — mobile-friendly

---

## Environment Variables

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/shopg
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRES_IN=7d
```
