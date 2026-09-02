export default function StatCard({ label, value, tone="", helper }) {
  return (
    <article className={`stat-card ${tone}`}>
      <p>{label}</p>
      <h3>{value}</h3>
      <span>{helper}</span>
    </article>
  );
}
