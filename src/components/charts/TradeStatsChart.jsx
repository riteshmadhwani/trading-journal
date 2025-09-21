import React from "react";
// You can use recharts or chart.js for actual charts
export default function TradeStatsChart({ trades }) {
  // Placeholder: show total trades and win rate
  const total = trades.length;
  const wins = trades.filter(t => t.result && Number(t.result) > 0).length;
  const winRate = total ? ((wins / total) * 100).toFixed(1) : 0;
  return (
    <div>
      <h3>Trade Stats</h3>
      <div>Total Trades: {total}</div>
      <div>Win Rate: {winRate}%</div>
      {/* Replace with chart library for more */}
    </div>
  );
}