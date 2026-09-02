import { useState } from "react";

const money = v => new Intl.NumberFormat("en-IN",{
  style:"currency",currency:"INR",maximumFractionDigits:0
}).format(v);

export default function BudgetPanel({month,budgets,expenseCategories,onSave,onDelete}) {
  const [category,setCategory] = useState("Food");
  const [limit,setLimit] = useState("");

  async function submit(e) {
    e.preventDefault();
    const ok = await onSave({month,category,limit_amount:Number(limit)});
    if (ok) setLimit("");
  }

  return (
    <section className="panel">
      <div className="panel-heading">
        <div><p className="eyebrow">Planning</p><h2>Monthly budgets</h2></div>
      </div>

      <form className="budget-form" onSubmit={submit}>
        <select value={category} onChange={e=>setCategory(e.target.value)}>
          {expenseCategories.map(c=><option key={c}>{c}</option>)}
        </select>
        <input type="number" min="1" step="1" value={limit}
          onChange={e=>setLimit(e.target.value)} placeholder="Budget limit" required />
        <button className="primary">Save</button>
      </form>

      <div className="budget-list">
        {!budgets.length ? <p className="empty compact">No budgets for this month.</p> :
          budgets.map(b=>{
            const pct=Math.min(100,Math.round((b.spent/b.limit_amount)*100));
            return (
              <article className="budget-item" key={b.id}>
                <div className="budget-line">
                  <strong>{b.category}</strong>
                  <span>{money(b.spent)} / {money(b.limit_amount)}</span>
                </div>
                <div className="progress"><span style={{width:`${pct}%`}} /></div>
                <div className="budget-line small">
                  <span>{pct}% used</span>
                  <button className="link-button danger" onClick={()=>onDelete(b.id)}>Remove</button>
                </div>
              </article>
            );
          })}
      </div>
    </section>
  );
}
