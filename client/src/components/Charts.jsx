import {
  Area,AreaChart,CartesianGrid,ResponsiveContainer,Tooltip,XAxis,YAxis,
  Pie,PieChart,Cell
} from "recharts";

const palette=["#7c3aed","#2563eb","#0f766e","#d97706","#dc2626","#9333ea","#0891b2"];
const money=v=>`₹${Number(v||0).toLocaleString("en-IN")}`;

export function TrendChart({data}) {
  return (
    <section className="panel chart-panel">
      <div className="panel-heading">
        <div><p className="eyebrow">12-month view</p><h2>Cash-flow trend</h2></div>
      </div>
      <div className="chart-box">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false}/>
            <XAxis dataKey="month" tickLine={false} axisLine={false}/>
            <YAxis tickFormatter={v=>`₹${Math.round(v/1000)}k`} tickLine={false} axisLine={false}/>
            <Tooltip formatter={v=>money(v)}/>
            <Area type="monotone" dataKey="income" stroke="#0f766e" fill="#ccfbf1" strokeWidth={2.5}/>
            <Area type="monotone" dataKey="expenses" stroke="#dc2626" fill="#fee2e2" strokeWidth={2.5}/>
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

export function CategoryChart({data}) {
  return (
    <section className="panel chart-panel">
      <div className="panel-heading">
        <div><p className="eyebrow">Breakdown</p><h2>Expense categories</h2></div>
      </div>

      {!data.length ? <p className="empty">Add expenses to see the chart.</p> : <>
        <div className="chart-box donut">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} dataKey="amount" nameKey="category"
                innerRadius={55} outerRadius={82} paddingAngle={3}>
                {data.map((x,i)=><Cell key={x.category} fill={palette[i%palette.length]}/>)}
              </Pie>
              <Tooltip formatter={v=>money(v)}/>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="legend">
          {data.slice(0,6).map((x,i)=>(
            <div key={x.category}>
              <span className="dot" style={{background:palette[i%palette.length]}}/>
              <span>{x.category}</span>
              <strong>{money(x.amount)}</strong>
            </div>
          ))}
        </div>
      </>}
    </section>
  );
}
