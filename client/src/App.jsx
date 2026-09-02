import { useCallback,useEffect,useMemo,useState } from "react";
import { api } from "./lib/api";
import StatCard from "./components/StatCard";
import TransactionForm from "./components/TransactionForm";
import TransactionTable from "./components/TransactionTable";
import BudgetPanel from "./components/BudgetPanel";
import { CategoryChart,TrendChart } from "./components/Charts";
import "./styles.css";

const currentMonth=new Date().toISOString().slice(0,7);
const money=v=>new Intl.NumberFormat("en-IN",{
  style:"currency",currency:"INR",maximumFractionDigits:0
}).format(Number(v||0));

export default function App() {
  const [month,setMonth]=useState(currentMonth);
  const [transactions,setTransactions]=useState([]);
  const [summary,setSummary]=useState(null);
  const [categoryData,setCategoryData]=useState([]);
  const [trendData,setTrendData]=useState([]);
  const [budgets,setBudgets]=useState([]);
  const [categories,setCategories]=useState([]);
  const [editing,setEditing]=useState(null);
  const [filters,setFilters]=useState({q:"",type:"",category:"",sort:"date_desc"});
  const [message,setMessage]=useState("");
  const [loading,setLoading]=useState(true);

  const expenseCategories=useMemo(
    ()=>categories.filter(c=>!["Salary","Freelance","Investment"].includes(c)),
    [categories]
  );

  const load=useCallback(async()=>{
    try {
      setLoading(true);
      const [tx,sum,cat,trend,budget,categoryList]=await Promise.all([
        api.getTransactions({month,...filters}),
        api.getSummary(month),
        api.getCategories(month),
        api.getTrends(),
        api.getBudgets(month),
        api.categories()
      ]);
      setTransactions(tx);
      setSummary(sum);
      setCategoryData(cat);
      setTrendData(trend);
      setBudgets(budget);
      setCategories(categoryList);
    } catch(err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  },[month,filters]);

  useEffect(()=>{ load(); },[load]);

  function flash(text) {
    setMessage(text);
    window.setTimeout(()=>setMessage(""),2500);
  }

  async function saveTransaction(payload) {
    try {
      if (editing) {
        await api.updateTransaction(editing.id,payload);
        setEditing(null);
        flash("Transaction updated.");
      } else {
        await api.createTransaction(payload);
        flash("Transaction added.");
      }
      await load();
      return true;
    } catch(err) {
      flash(err.message);
      return false;
    }
  }

  async function deleteTransaction(id) {
    if (!window.confirm("Delete this transaction?")) return;
    try {
      await api.deleteTransaction(id);
      if (editing?.id===id) setEditing(null);
      flash("Transaction deleted.");
      await load();
    } catch(err) {
      flash(err.message);
    }
  }

  async function saveBudget(payload) {
    try {
      await api.saveBudget(payload);
      flash("Budget saved.");
      await load();
      return true;
    } catch(err) {
      flash(err.message);
      return false;
    }
  }

  async function deleteBudget(id) {
    try {
      await api.deleteBudget(id);
      flash("Budget removed.");
      await load();
    } catch(err) {
      flash(err.message);
    }
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">S</div>
          <div><strong>SpendWise</strong><span>Personal finance</span></div>
        </div>

        <nav>
          <a className="active" href="#dashboard">Overview</a>
          <a href="#transactions">Transactions</a>
          <a href="#budgets">Budgets</a>
          <a href="#analytics">Analytics</a>
        </nav>

        <div className="sidebar-note">
          <strong>Financial clarity</strong>
          <p>Track where your money goes and make better monthly decisions.</p>
        </div>
      </aside>

      <main>
        <header className="topbar" id="dashboard">
          <div>
            <p className="eyebrow">Personal finance dashboard</p>
            <h1>Understand your money at a glance.</h1>
            <p className="subtext">Track income, control spending, and stay within budget.</p>
          </div>

          <label className="month-picker">Month
            <input type="month" value={month} onChange={e=>setMonth(e.target.value)}/>
          </label>
        </header>

        {message && <div className="toast">{message}</div>}

        <section className="stats-grid">
          <StatCard label="Income" value={money(summary?.income)} tone="income"
            helper={`${summary?.transactions||0} transactions`}/>
          <StatCard label="Expenses" value={money(summary?.expenses)} tone="expense"
            helper={summary?.top_category ? `Top: ${summary.top_category.category}` : "No spending yet"}/>
          <StatCard label="Balance" value={money(summary?.balance)}
            helper="Income minus expenses"/>
          <StatCard label="Budget" value={money(summary?.total_budget)}
            helper={summary?.total_budget
              ? `${Math.min(100,Math.round(summary.expenses/summary.total_budget*100))}% used`
              : "Set monthly limits"}/>
        </section>

        <section className="content-grid" id="analytics">
          <TrendChart data={trendData}/>
          <CategoryChart data={categoryData}/>
        </section>

        <section className="workspace-grid">
          <div id="transactions">
            <TransactionForm categories={categories}
              editing={editing} onSubmit={saveTransaction} onCancel={()=>setEditing(null)}/>
          </div>
          <div id="budgets">
            <BudgetPanel month={month} budgets={budgets}
              expenseCategories={expenseCategories} onSave={saveBudget} onDelete={deleteBudget}/>
          </div>
        </section>

        <section className="filters">
          <input placeholder="Search note or category..." value={filters.q}
            onChange={e=>setFilters(f=>({...f,q:e.target.value}))}/>
          <select value={filters.type}
            onChange={e=>setFilters(f=>({...f,type:e.target.value}))}>
            <option value="">All types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <select value={filters.category}
            onChange={e=>setFilters(f=>({...f,category:e.target.value}))}>
            <option value="">All categories</option>
            {categories.map(c=><option key={c}>{c}</option>)}
          </select>
          <select value={filters.sort}
            onChange={e=>setFilters(f=>({...f,sort:e.target.value}))}>
            <option value="date_desc">Newest first</option>
            <option value="date_asc">Oldest first</option>
            <option value="amount_desc">Highest amount</option>
            <option value="amount_asc">Lowest amount</option>
          </select>
        </section>

        {loading
          ? <div className="loading">Loading SpendWise…</div>
          : <TransactionTable transactions={transactions}
              onEdit={setEditing} onDelete={deleteTransaction}/>}

        <footer>SpendWise • Personal Finance & Expense Analytics</footer>
      </main>
    </div>
  );
}
