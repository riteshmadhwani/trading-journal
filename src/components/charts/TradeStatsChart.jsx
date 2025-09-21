import React, { useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";
Chart.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function TradeStatsChart({ trades }) {
  // Filter state
  const [filter, setFilter] = useState({
    symbol: "",
    strategy: "",
    minResult: "",
    maxResult: "",
  });

  // Filter trades
  const filteredTrades = trades.filter(t => {
    const symbolMatch = filter.symbol ? t.symbol?.toLowerCase().includes(filter.symbol.toLowerCase()) : true;
    const strategyMatch = filter.strategy ? t.strategy === filter.strategy : true;
    const minResultMatch = filter.minResult ? Number(t.result) >= Number(filter.minResult) : true;
    const maxResultMatch = filter.maxResult ? Number(t.result) <= Number(filter.maxResult) : true;
    return symbolMatch && strategyMatch && minResultMatch && maxResultMatch;
  });

  // Stats
  const total = filteredTrades.length;
  const wins = filteredTrades.filter(t => t.result && Number(t.result) > 0).length;
  const winRate = total ? ((wins / total) * 100).toFixed(1) : 0;

  // Prepare chart data (group by strategy)
  const strategies = [...new Set(filteredTrades.map(t => t.strategy))];
  const tradesPerStrategy = strategies.map(s =>
    filteredTrades.filter(t => t.strategy === s).length
  );
  const winRatePerStrategy = strategies.map(s => {
    const stratTrades = filteredTrades.filter(t => t.strategy === s);
    const stratWins = stratTrades.filter(t => t.result && Number(t.result) > 0).length;
    return stratTrades.length ? ((stratWins / stratTrades.length) * 100).toFixed(1) : 0;
  });

  const chartData = {
    labels: strategies,
    datasets: [
      {
        label: "Trades",
        data: tradesPerStrategy,
        backgroundColor: "rgba(255, 206, 86, 0.7)",
      },
      {
        label: "Win Rate (%)",
        data: winRatePerStrategy,
        backgroundColor: "rgba(54, 162, 235, 0.7)",
      },
    ],
  };

  return (
    <div className="bg-gray-900 rounded-2xl p-6 shadow-xl mt-8">
      <h3 className="text-2xl font-bold text-yellow-400 mb-4">Trade Stats</h3>
      <div className="flex flex-wrap gap-6 mb-6">
        <div className="flex flex-col">
          <label className="text-yellow-300 font-semibold mb-1">Symbol</label>
          <input
            className="px-3 py-1 rounded bg-gray-800 text-yellow-200 border border-yellow-700"
            value={filter.symbol}
            onChange={e => setFilter(f => ({ ...f, symbol: e.target.value }))}
            placeholder="e.g. BTC"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-yellow-300 font-semibold mb-1">Strategy</label>
          <input
            className="px-3 py-1 rounded bg-gray-800 text-yellow-200 border border-yellow-700"
            value={filter.strategy}
            onChange={e => setFilter(f => ({ ...f, strategy: e.target.value }))}
            placeholder="e.g. Swing"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-yellow-300 font-semibold mb-1">Min Result</label>
          <input
            className="px-3 py-1 rounded bg-gray-800 text-yellow-200 border border-yellow-700"
            value={filter.minResult}
            onChange={e => setFilter(f => ({ ...f, minResult: e.target.value }))}
            type="number"
            placeholder="Min"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-yellow-300 font-semibold mb-1">Max Result</label>
          <input
            className="px-3 py-1 rounded bg-gray-800 text-yellow-200 border border-yellow-700"
            value={filter.maxResult}
            onChange={e => setFilter(f => ({ ...f, maxResult: e.target.value }))}
            type="number"
            placeholder="Max"
          />
        </div>
      </div>
      <div className="flex gap-8 items-center mb-8">
        <div className="text-lg text-yellow-200 font-bold">
          Total Trades: <span className="text-yellow-400">{total}</span>
        </div>
        <div className="text-lg text-yellow-200 font-bold">
          Win Rate: <span className="text-green-400">{winRate}%</span>
        </div>
      </div>
      <div className="bg-gray-800 rounded-xl p-4">
        <Bar data={chartData} options={{
          responsive: true,
          plugins: {
            legend: { labels: { color: "#FFD600" } },
          },
          scales: {
            x: { ticks: { color: "#FFD600" }, grid: { color: "#333" } },
            y: { ticks: { color: "#FFD600" }, grid: { color: "#333" } },
          },
        }} />
      </div>
    </div>
  );
}