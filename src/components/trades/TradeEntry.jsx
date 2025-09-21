import React, { useState } from "react";
import { db } from "../../services/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useAuth } from "../../hooks/useAuth";

const TAG_OPTIONS = ["Swing", "Scalp", "Options", "Long", "Short"];

export default function TradeEntry({ strategies }) {
  const { user } = useAuth();
  const [form, setForm] = useState({
    date: "",
    symbol: "",
    strategy: "",
    entry: "",
    exit: "",
    notes: "",
    result: "",
    tags: [],
    profitLoss: "",
  });

  // Calculate profit/loss automatically
  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    let updatedForm = { ...form, [name]: type === "checkbox" ? checked : value };

    // Auto-calculate profit/loss if entry and exit are numbers
    if ((name === "entry" || name === "exit") && !isNaN(Number(value))) {
      const entry = Number(name === "entry" ? value : updatedForm.entry);
      const exit = Number(name === "exit" ? value : updatedForm.exit);
      if (!isNaN(entry) && !isNaN(exit)) {
        updatedForm.profitLoss = (exit - entry).toFixed(2);
      }
    }

    setForm(updatedForm);
  };

  const handleTagChange = tag => {
    setForm(f => ({
      ...f,
      tags: f.tags.includes(tag)
        ? f.tags.filter(t => t !== tag)
        : [...f.tags, tag],
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    await addDoc(collection(db, "trades"), {
      ...form,
      userId: user.uid,
      createdAt: serverTimestamp(),
    });
    setForm({
      date: "",
      symbol: "",
      strategy: "",
      entry: "",
      exit: "",
      notes: "",
      result: "",
      tags: [],
      profitLoss: "",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 bg-gray-900 p-6 rounded-2xl shadow-2xl border-4 border-yellow-700">
      <input name="date" type="date" value={form.date} onChange={handleChange} required className="px-4 py-2 rounded-xl border-2 border-yellow-700 bg-gray-900 text-yellow-300 focus:ring-2 focus:ring-yellow-400 placeholder-yellow-600 shadow-inner" />
      <input name="symbol" placeholder="Symbol" value={form.symbol} onChange={handleChange} required className="px-4 py-2 rounded-xl border-2 border-yellow-700 bg-gray-900 text-yellow-300 focus:ring-2 focus:ring-yellow-400 placeholder-yellow-600 shadow-inner" />
      <select name="strategy" value={form.strategy} onChange={handleChange} required className="px-4 py-2 rounded-xl border-2 border-yellow-700 bg-gray-900 text-yellow-300 focus:ring-2 focus:ring-yellow-400 shadow-inner">
        <option value="">Select Strategy</option>
        {strategies.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
      </select>
      <input name="entry" placeholder="Entry Price" value={form.entry} onChange={handleChange} required className="px-4 py-2 rounded-xl border-2 border-yellow-700 bg-gray-900 text-yellow-300 focus:ring-2 focus:ring-yellow-400 placeholder-yellow-600 shadow-inner" />
      <input name="exit" placeholder="Exit Price" value={form.exit} onChange={handleChange} required className="px-4 py-2 rounded-xl border-2 border-yellow-700 bg-gray-900 text-yellow-300 focus:ring-2 focus:ring-yellow-400 placeholder-yellow-600 shadow-inner" />
      <input name="result" placeholder="Result" value={form.result} onChange={handleChange} required className="px-4 py-2 rounded-xl border-2 border-yellow-700 bg-gray-900 text-yellow-300 focus:ring-2 focus:ring-yellow-400 placeholder-yellow-600 shadow-inner" />
      <textarea name="notes" placeholder="Notes" value={form.notes} onChange={handleChange} className="md:col-span-2 px-4 py-2 rounded-xl border-2 border-yellow-700 bg-gray-900 text-yellow-300 focus:ring-2 focus:ring-yellow-400 placeholder-yellow-600 shadow-inner min-h-[60px]" />
      <div className="md:col-span-2 flex flex-wrap gap-2 items-center">
        <span className="text-yellow-400 font-bold">Tags:</span>
        {TAG_OPTIONS.map(tag => (
          <label key={tag} className="flex items-center gap-1 text-yellow-300">
            <input
              type="checkbox"
              checked={form.tags.includes(tag)}
              onChange={() => handleTagChange(tag)}
              className="accent-yellow-500"
            />
            {tag}
          </label>
        ))}
      </div>
      <div className="md:col-span-2 flex items-center gap-2">
        <span className="text-yellow-400 font-bold">Profit/Loss:</span>
        <span className={`font-bold ${form.profitLoss >= 0 ? "text-green-400" : "text-red-400"}`}>
          {form.profitLoss}
        </span>
      </div>
      <button type="submit" className="md:col-span-2 mt-4 px-8 py-3 rounded-xl bg-gradient-to-r from-yellow-500 via-yellow-700 to-gray-900 text-gray-900 font-extrabold shadow-lg hover:scale-105 transition flex items-center gap-2 justify-center">
        Add Trade
      </button>
    </form>
  );
}