import { Router } from "express";
import db from "../db/database.js";
import { validateBudget } from "../utils/validation.js";

const router = Router();

router.get("/", (req, res) => {
  const month = req.query.month;
  const base = `
    SELECT b.*,
      COALESCE((
        SELECT SUM(t.amount)
        FROM transactions t
        WHERE t.type='expense'
          AND t.category=b.category
          AND substr(t.transaction_date,1,7)=b.month
      ),0) AS spent
    FROM budgets b
  `;

  const rows = month && /^\d{4}-\d{2}$/.test(month)
    ? db.prepare(base + " WHERE b.month=? ORDER BY b.category").all(month)
    : db.prepare(base + " ORDER BY b.month DESC,b.category").all();

  res.json(rows);
});

router.post("/", (req, res) => {
  const result = validateBudget(req.body);
  if (!result.valid) return res.status(400).json({ message: result.errors.join(" ") });

  const { month, category, limit_amount } = result.value;
  db.prepare(`
    INSERT INTO budgets(month,category,limit_amount)
    VALUES(?,?,?)
    ON CONFLICT(month,category) DO UPDATE SET
      limit_amount=excluded.limit_amount,
      updated_at=datetime('now')
  `).run(month, category, limit_amount);

  res.status(201).json(
    db.prepare("SELECT * FROM budgets WHERE month=? AND category=?").get(month, category)
  );
});

router.delete("/:id", (req, res) => {
  const info = db.prepare("DELETE FROM budgets WHERE id=?").run(Number(req.params.id));
  if (!info.changes) return res.status(404).json({ message: "Budget not found." });
  res.status(204).end();
});

export default router;
