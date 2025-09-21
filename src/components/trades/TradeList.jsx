import React from "react";
import { useTrades } from "../../hooks/useTrades";

export default function TradeList() {
  const trades = useTrades();
  return (
    <div>
      <h2>Your Trades</h2>
      <ul>
        {trades.map(trade => (
          <li key={trade.id}>
            {trade.date} - {trade.symbol} - {trade.strategy} - {trade.result}
          </li>
        ))}
      </ul>
    </div>
  );
}