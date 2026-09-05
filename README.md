# SpendWise — Personal Finance & Expense Analytics

A polished full-stack personal finance application built with React, Vite, Node.js, Express, SQLite, and Recharts.
## Live Demo

**Frontend:** https://energetic-youth-production.up.railway.app

The application is deployed on Railway with separate frontend and backend services and persistent SQLite storage.
## Core Features
- Add, edit, delete income and expenses
- Category-based transaction management
- Monthly budgets with usage progress
- Monthly income, expense, balance, and budget statistics
- Expense-category donut chart
- 12-month cash-flow trend chart
- Search, filters, and sorting
- Responsive dashboard
- Persistent SQLite storage
- REST API
- Input validation
- Helmet security headers
- API rate limiting
- Deployment-ready environment configuration

## Architecture
React/Vite Frontend → REST API → Express Backend → SQLite Database

## Local Setup

### Backend
```bash
cd server
npm install
copy .env.example .env
npm run dev
```

### Frontend
```bash
cd client
npm install
copy .env.example .env
npm run dev
```

Open `http://localhost:5173`.

## Main API Endpoints
- GET `/api/health`
- GET `/api/transactions`
- POST `/api/transactions`
- PUT `/api/transactions/:id`
- DELETE `/api/transactions/:id`
- GET `/api/categories`
- GET `/api/budgets`
- POST `/api/budgets`
- DELETE `/api/budgets/:id`
- GET `/api/analytics/summary`
- GET `/api/analytics/categories`
- GET `/api/analytics/trends`

## Finalization Checklist
Before calling the project complete:
1. Test all CRUD operations.
2. Test filtering and sorting.
3. Test budget calculations.
4. Test analytics charts.
5. Check mobile layout.
6. Push to GitHub.
7. Add screenshots/live links to README.
8. Deploy frontend and backend.
9. Verify database persistence after restart.
