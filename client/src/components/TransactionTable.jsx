const money = v => new Intl.NumberFormat("en-IN",{
  style:"currency",currency:"INR",maximumFractionDigits:2
}).format(v);

export default function TransactionTable({ transactions,onEdit,onDelete }) {
  return (
    <section className="panel table-panel">
      <div className="panel-heading">
        <div><p className="eyebrow">Activity</p><h2>Transactions</h2></div>
        <span className="count-badge">{transactions.length}</span>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Date</th><th>Category</th><th>Note</th><th>Type</th>
              <th className="amount-cell">Amount</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {!transactions.length ? (
              <tr><td colSpan="6" className="empty">No matching transactions yet.</td></tr>
            ) : transactions.map(item=>(
              <tr key={item.id}>
                <td>{new Date(item.transaction_date+"T00:00:00").toLocaleDateString("en-IN")}</td>
                <td><span className="category-chip">{item.category}</span></td>
                <td>{item.note || "—"}</td>
                <td><span className={`type-chip ${item.type}`}>{item.type}</span></td>
                <td className={`amount-cell ${item.type}`}>
                  {item.type==="income"?"+":"−"}{money(item.amount)}
                </td>
                <td>
                  <div className="row-actions">
                    <button className="link-button" onClick={()=>onEdit(item)}>Edit</button>
                    <button className="link-button danger" onClick={()=>onDelete(item.id)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
