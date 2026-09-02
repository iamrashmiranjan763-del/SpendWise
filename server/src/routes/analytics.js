import { Router } from "express";
import db from "../db/database.js";

const router = Router();

function monthOrCurrent(value) {
  return /^\d{4}-\d{2}$/.test(value || "")
    ? value
    : new Date().toISOString().slice(0,7);
}

router.get("/summary", (req, res) => {
  const month = monthOrCurrent(req.query.month);

  const totals = db.prepare(`
    SELECT
      COALESCE(SUM(CASE WHEN type='income' THEN amount END),0) AS income,
      COALESCE(SUM(CASE WHEN type='expense' THEN amount END),0) AS expenses,
      COUNT(*) AS transactions
    FROM transactions
    WHERE substr(transaction_date,1,7)=?
  `).get(month);

  const budget = db.prepare(`
    SELECT COALESCE(SUM(limit_amount),0) AS total_budget
    FROM budgets WHERE month=?
  `).get(month);

  const top = db.prepare(`
    SELECT category,SUM(amount) AS total
    FROM transactions
    WHERE type='expense' AND substr(transaction_date,1,7)=?
    GROUP BY category ORDER BY total DESC LIMIT 1
  `).get(month);

  res.json({
    month,
    income: Number(totals.income || 0),
    expenses: Number(totals.expenses || 0),
    balance: Number((totals.income || 0) - (totals.expenses || 0)),
    transactions: totals.transactions,
    total_budget: Number(budget.total_budget || 0),
    top_category: top || null
  });
});

router.get("/categories", (req, res) => {
  const month = monthOrCurrent(req.query.month);
  res.json(db.prepare(`
    SELECT category,ROUND(SUM(amount),2) AS amount
    FROM transactions
    WHERE type='expense' AND substr(transaction_date,1,7)=?
    GROUP BY category ORDER BY amount DESC
  `).all(month));
});

router.get("/trends", (req, res) => {
  res.json(db.prepare(`
    SELECT
      substr(transaction_date,1,7) AS month,
      ROUND(SUM(CASE WHEN type='income' THEN amount ELSE 0 END),2) AS income,
      ROUND(SUM(CASE WHEN type='expense' THEN amount ELSE 0 END),2) AS expenses
    FROM transactions
    GROUP BY substr(transaction_date,1,7)
    ORDER BY month ASC
    LIMIT 12
  `).all());
});

export default router;
