export const categories = [
  "Salary","Freelance","Investment","Food","Transport","Shopping",
  "Bills","Health","Education","Entertainment","Travel","Other"
];

export function validateTransaction(payload) {
  const errors = [];
  const type = String(payload.type || "").trim().toLowerCase();
  const amount = Number(payload.amount);
  const category = String(payload.category || "").trim();
  const note = String(payload.note || "").trim();
  const transactionDate = String(payload.transaction_date || "").trim();

  if (!["income","expense"].includes(type)) errors.push("Type must be income or expense.");
  if (!Number.isFinite(amount) || amount <= 0 || amount > 100000000)
    errors.push("Amount must be a positive number.");
  if (!category || category.length > 40) errors.push("Category is required.");
  if (note.length > 180) errors.push("Note must be under 180 characters.");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(transactionDate))
    errors.push("Date must use YYYY-MM-DD format.");

  return {
    valid: errors.length === 0,
    errors,
    value: { type, amount, category, note, transaction_date: transactionDate }
  };
}

export function validateBudget(payload) {
  const errors = [];
  const month = String(payload.month || "").trim();
  const category = String(payload.category || "").trim();
  const limitAmount = Number(payload.limit_amount);

  if (!/^\d{4}-\d{2}$/.test(month)) errors.push("Month must use YYYY-MM format.");
  if (!category || category.length > 40) errors.push("Category is required.");
  if (!Number.isFinite(limitAmount) || limitAmount <= 0 || limitAmount > 100000000)
    errors.push("Budget must be a positive number.");

  return {
    valid: errors.length === 0,
    errors,
    value: { month, category, limit_amount: limitAmount }
  };
}
