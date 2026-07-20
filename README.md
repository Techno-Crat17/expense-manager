# Expense Tracker - MERN Stack Web Application

A full-stack, production-quality **Expense Tracker Web Application** engineered for personal finance management, budget analytics, and transaction reporting. Designed specifically as a portfolio project for 3rd-Year Computer Science Engineering students.

---

## 🌟 Key Features

### 🔐 1. Authentication & Security
- User registration and login using **JSON Web Tokens (JWT)**.
- Secure password hashing using **bcryptjs**.
- Protected API endpoints & client-side route guards (`ProtectedRoute`).

### 📊 2. Interactive Dashboard & Analytics
- Live overview cards: **Total Balance**, **Total Income**, **Total Expense**, and **Savings Rate**.
- Data visualization powered by **Chart.js** & **react-chartjs-2**:
  - **Category Spending Breakdown** (Doughnut / Pie Chart)
  - **Monthly Income vs Expense Trend** (Bar Chart)

### 💸 3. Transaction Management & Categories
- Full CRUD capabilities: Add, edit, delete, and view income and expense entries.
- Support for **9 distinct categories**:
  `Food`, `Shopping`, `Rent`, `Salary`, `Education`, `Entertainment`, `Medical`, `Transport`, `Others`.
- Comprehensive search by title, category filtering, type filtering (income/expense), date range picking, and sorting.

### 📄 4. Reports & CSV Export
- Generate printable monthly financial summary reports.
- One-click **Export to CSV** for offline spreadsheet analysis.

### 🎨 5. Modern UI / UX
- Responsive design tailored with **Tailwind CSS**.
- Integrated **Dark / Light Mode** theme switcher with instant persistence.
- Toast notifications, custom scrollbars, loading spinners, and empty-state illustrations.

---

## 🛠 Tech Stack

| Domain | Technology |
| :--- | :--- |
| **Frontend Framework** | React 18 + Vite |
| **Styling Framework** | Tailwind CSS |
| **Icons & Charts** | Lucide React, Chart.js, React-Chartjs-2 |
| **HTTP Client** | Axios (with Request Interceptors) |
| **Backend Runtime** | Node.js + Express.js (MVC Architecture) |
| **Database ORM** | MongoDB + Mongoose |
| **Auth & Security** | JWT (jsonwebtoken) & bcryptjs |

---

## 📁 Folder Structure

```
expense-tracker/
│
├── client/                      # React Frontend (Vite)
│   ├── src/
│   │   ├── components/          # Navbar, Sidebar, SummaryCard, CategoryBadge, Toast, Charts, Modals
│   │   ├── context/             # AuthContext & ThemeContext
│   │   ├── pages/               # Login, Register, Dashboard, Transactions, Analytics, Reports
│   │   ├── services/            # Axios API Configuration with JWT interceptors
│   │   ├── App.jsx              # Main Router & Provider setup
│   │   ├── index.css            # Tailwind directives & custom scrollbars
│   │   └── main.jsx             # React DOM entry point
│   ├── index.html
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
│
├── server/                      # Node.js Express Backend
│   ├── config/                  # MongoDB Connection (db.js)
│   ├── controllers/             # AuthController & TransactionController
│   ├── middleware/              # AuthMiddleware & ErrorMiddleware
│   ├── models/                  # User & Transaction Mongoose Schemas
│   ├── routes/                  # Auth & Transaction Express Routes
│   ├── utils/                   # JWT Token Generator
│   ├── .env                     # Server environment variables
│   ├── server.js                # Express App Server Entry
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v16+ recommended)
- MongoDB installed locally OR a MongoDB Atlas cluster URI.

### 1. Backend Setup
```bash
cd server
npm install
```

Create a `.env` file inside `server/`:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/expense_tracker
JWT_SECRET=your_super_secret_jwt_key_2026
NODE_ENV=development
```

Start the backend server:
```bash
npm run dev
```
*(Server will start on `http://localhost:5000`)*

### 2. Frontend Setup
Open a new terminal window:
```bash
cd client
npm install
npm run dev
```
*(Client will run on `http://localhost:3000` with automatic proxy to `/api`)*

---

## 📡 API Endpoints Summary

### Authentication Routes (`/api/auth`)
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Authenticate & obtain JWT
- `GET  /api/auth/profile` - Fetch current user details *(Protected)*

### Transaction Routes (`/api/transactions`)
- `GET    /api/transactions` - Fetch user transactions (with search, category, type, date filter) *(Protected)*
- `POST   /api/transactions` - Create a new transaction *(Protected)*
- `PUT    /api/transactions/:id` - Update existing transaction *(Protected)*
- `DELETE /api/transactions/:id` - Remove transaction *(Protected)*
- `GET    /api/transactions/summary` - Fetch dashboard metrics & chart aggregates *(Protected)*

---

## 📜 License
This project is open source and available under the [MIT License](LICENSE).
