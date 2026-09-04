import { useEffect, useState } from "react";

const blank = () => ({
  type:"expense",
  amount:"",
  category:"Food",
  note:"",
  transaction_date:new Date().toISOString().slice(0,10)
});

export default function TransactionForm({ categories, editing, onSubmit, onCancel }) {
  const [form,setForm] = useState(blank());

  useEffect(() => {
    setForm(editing ? {
      type:editing.type,
      amount:editing.amount,
      category:editing.category,
      note:editing.note || "",
      transaction_date:editing.transaction_date
    } : blank());
  }, [editing]);

  const visible = form.type === "income"
    ? ["Salary","Freelance","Investment","Other"]
    : categories.filter(c => !["Salary","Freelance","Investment"].includes(c));

  async function submit(e) {
    e.preventDefault();
    const ok = await onSubmit({...form, amount:Number(form.amount)});
    if (ok && !editing) setForm(blank());
  }

  return (
    <form className="panel form-panel" onSubmit={submit}>
      <div className="panel-heading">
        <div>
          <p className="eyebrow">{editing ? "Editing" : "New transaction"}</p>
          <h2>{editing ? "Update transaction" : "Record money movement"}</h2>
        </div>
      </div>

      <div className="segmented">
        <button type="button" className={form.type==="expense"?"active":""}
          onClick={() => setForm(f=>({...f,type:"expense",category:"Food"}))}>Expense</button>
        <button type="button" className={form.type==="income"?"active":""}
          onClick={() => setForm(f=>({...f,type:"income",category:"Salary"}))}>Income</button>
      </div>

      <label>Amount
        <input type="number" min="0.01" step="0.01" value={form.amount}
          onChange={e=>setForm(f=>({...f,amount:e.target.value}))}
          placeholder="Enter amount"required />
      </label>

      <label>Category
        <select value={form.category} onChange={e=>setForm(f=>({...f,category:e.target.value}))}>
          {visible.map(c=><option key={c}>{c}</option>)}
        </select>
      </label>

      <label>Date
        <input type="date" value={form.transaction_date}
          onChange={e=>setForm(f=>({...f,transaction_date:e.target.value}))} required />
      </label>

      <label>Note
        <input maxLength="180" value={form.note}
          onChange={e=>setForm(f=>({...f,note:e.target.value}))}
          placeholder="Optional note" />
      </label>

      <div className="form-actions">
        <button className="primary" type="submit">
          {editing ? "Save changes" : "Add transaction"}
        </button>
        {editing && <button className="ghost" type="button" onClick={onCancel}>Cancel</button>}
      </div>
    </form>
  );
}
