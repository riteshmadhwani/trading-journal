import React from "react";
import TradeEntry from "../components/trades/TradeEntry";
import TradeList from "../components/trades/TradeList";
import { useAuth } from "../hooks/useAuth";
import { useTrades } from "../hooks/useTrades";
import TradeStatsChart from "../components/charts/TradeStatsChart";

export default function TradeJournal({ strategies }) {
  const trades = useTrades();
  return (
  <div>
    <h2 className="text-2xl font-bold text-indigo-700 mb-6">Your Trades</h2>
    <div className="mb-8">
      <TradeEntry strategies={strategies} />
    </div>
    <div className="mb-8">
      <TradeList />
    </div>
    <div>
      <TradeStatsChart trades={trades} />
    </div>
  </div>
);
}