export default function Dashboard() {
  return (
    <div>
      <h3>Dashboard</h3>
      <div style={{ display: "flex", gap: 16 }}>
        <div style={{ padding: 20, background: "#e5e7eb" }}>Users: 120</div>
        <div style={{ padding: 20, background: "#e5e7eb" }}>Sales: ₱45,000</div>
        <div style={{ padding: 20, background: "#e5e7eb" }}>Active: 32</div>
      </div>
    </div>
  );
}