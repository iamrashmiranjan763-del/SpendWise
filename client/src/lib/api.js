const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options
  });

  if (response.status === 204) return null;

  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || "Something went wrong.");
  return data;
}

export const api = {
  categories: () => request("/categories"),
  getTransactions: (params = {}) => {
    const q = new URLSearchParams(
      Object.entries(params).filter(([,v]) => v !== "" && v != null)
    );
    return request(`/transactions?${q}`);
  },
  createTransaction: payload =>
    request("/transactions", { method:"POST", body:JSON.stringify(payload) }),
  updateTransaction: (id,payload) =>
    request(`/transactions/${id}`, { method:"PUT", body:JSON.stringify(payload) }),
  deleteTransaction: id =>
    request(`/transactions/${id}`, { method:"DELETE" }),
  getBudgets: month => request(`/budgets?month=${month}`),
  saveBudget: payload =>
    request("/budgets", { method:"POST", body:JSON.stringify(payload) }),
  deleteBudget: id =>
    request(`/budgets/${id}`, { method:"DELETE" }),
  getSummary: month => request(`/analytics/summary?month=${month}`),
  getCategories: month => request(`/analytics/categories?month=${month}`),
  getTrends: () => request("/analytics/trends")
};
