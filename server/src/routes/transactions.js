import { Router } from "express";
import db from "../db/database.js";
import { validateTransaction } from "../utils/validation.js";

const router = Router();

router.get("/", (req, res) => {
  const { type, category, q, month, sort = "date_desc" } = req.query;
  const clauses = [];
  const params = {};

  if (["income","expense"].includes(type)) {
    clauses.push("type=@type"); params.type = type;
  }
  if (category) {
    clauses.push("category=@category"); params.category = category;
  }
  if (q) {
    clauses.push("(note LIKE @q OR category LIKE @q)"); params.q = `%${q}%`;
  }
  if (month && /^\d{4}-\d{2}$/.test(month)) {
    clauses.push("substr(transaction_date,1,7)=@month"); params.month = month;
  }

  const orderBy = ({
    date_desc: "transaction_date DESC,id DESC",
    date_asc: "transaction_date ASC,id ASC",
    amount_desc: "amount DESC",
    amount_asc: "amount ASC"
  })[sort] || "transaction_date DESC,id DESC";

  const sql = `SELECT * FROM transactions
    ${clauses.length ? `WHERE ${clauses.join(" AND ")}` : ""}
    ORDER BY ${orderBy}`;

  res.json(db.prepare(sql).all(params));
});

router.post("/", (req, res) => {
  const result = validateTransaction(req.body);
  if (!result.valid) return res.status(400).json({ message: result.errors.join(" ") });

  const { type, amount, category, note, transaction_date } = result.value;
  const info = db.prepare(`
    INSERT INTO transactions(type,amount,category,note,transaction_date)
    VALUES(?,?,?,?,?)
  `).run(type, amount, category, note, transaction_date);

  res.status(201).json(
    db.prepare("SELECT * FROM transactions WHERE id=?").get(info.lastInsertRowid)
  );
});

router.put("/:id", (req, res) => {
  const id = Number(req.params.id);
  if (!db.prepare("SELECT id FROM transactions WHERE id=?").get(id))
    return res.status(404).json({ message: "Transaction not found." });

  const result = validateTransaction(req.body);
  if (!result.valid) return res.status(400).json({ message: result.errors.join(" ") });

  const { type, amount, category, note, transaction_date } = result.value;
  db.prepare(`
    UPDATE transactions
    SET type=?,amount=?,category=?,note=?,transaction_date=?,
        updated_at=datetime('now')
    WHERE id=?
  `).run(type, amount, category, note, transaction_date, id);

  res.json(db.prepare("SELECT * FROM transactions WHERE id=?").get(id));
});

router.delete("/:id", (req, res) => {
  const info = db.prepare("DELETE FROM transactions WHERE id=?").run(Number(req.params.id));
  if (!info.changes) return res.status(404).json({ message: "Transaction not found." });
  res.status(204).end();
});

export default router;
