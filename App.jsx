import React, { useState, useEffect } from "react";
import { useAuth } from "./src/hooks/useAuth";
import LoginPage from "./src/components/auth/LoginPage";
import RegisterPage from "./src/components/auth/RegisterPage";
import Home from "./src/pages/Home";
import TradeJournal from "./src/pages/TradeJournal";
import StrategyManagerPage from "./src/pages/StrategyManager";
import { db, auth } from "./src/services/firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { signOut } from "firebase/auth";

export default function App() {
  const { user, loading } = useAuth();
  const [showRegister, setShowRegister] = useState(false);
  const [page, setPage] = useState("journal");
  const [strategies, setStrategies] = useState([]);

  useEffect(() => {
    if (!user) {
      setStrategies([]);
      return;
    }
    const q = query(collection(db, "strategies"), where("userId", "==", user.uid));
    const unsub = onSnapshot(q, snap => {
      setStrategies(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsub();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-500 to-pink-400">
        <div className="text-3xl font-extrabold text-white animate-bounce tracking-wide drop-shadow-lg">
          Loading...
        </div>
      </div>
    );
  }

  if (!user) {
    return showRegister ? (
      <RegisterPage onLogin={() => setShowRegister(false)} />
    ) : (
      <LoginPage onRegister={() => setShowRegister(true)} />
    );
  }

  // Logout handler
  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-500 to-pink-400 pb-12">
      {/* NAVBAR */}
      <nav className="flex justify-between items-center px-8 py-5 bg-white/20 backdrop-blur-xl shadow-xl rounded-b-3xl mb-10 border border-white/30">
        {/* Brand */}
        <div className="flex items-center gap-4">
          <span className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 via-pink-500 to-yellow-400 drop-shadow">
            Trading Journal
          </span>
          <span className="ml-4 px-3 py-1 rounded-full bg-gradient-to-r from-indigo-200 to-pink-200 text-indigo-900 font-semibold text-sm shadow">
            {user.displayName || user.email}
          </span>
        </div>

        {/* Menu */}
        <div className="relative group">
          <button className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-pink-500 to-yellow-400 text-white font-bold shadow-lg hover:scale-105 active:scale-95 transition-all duration-200 flex items-center gap-2">
            <span>☰</span> Menu
          </button>

          {/* Dropdown */}
          <div className="absolute right-0 mt-3 w-64 bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl transform scale-95 opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100 transition-all duration-300 z-20 border border-white/40">
            <ul className="divide-y divide-gray-100">
              <li>
                <button
                  className={`w-full flex items-center gap-3 px-5 py-3 rounded-xl transition ${
                    page === "strategies"
                      ? "bg-gradient-to-r from-pink-100 to-yellow-100 text-indigo-900 font-bold"
                      : "hover:bg-gradient-to-r hover:from-pink-50 hover:to-yellow-50 text-indigo-700 font-semibold"
                  }`}
                  onClick={() => setPage("strategies")}
                >
                  📂 <span>Manage Categories</span>
                </button>
              </li>
              <li>
                <button
                  className={`w-full flex items-center gap-3 px-5 py-3 rounded-xl transition ${
                    page === "journal"
                      ? "bg-gradient-to-r from-indigo-100 to-pink-100 text-indigo-900 font-bold"
                      : "hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50 text-indigo-700 font-semibold"
                  }`}
                  onClick={() => setPage("journal")}
                >
                  📖 <span>Journal</span>
                </button>
              </li>
              <li>
                <button
                  className={`w-full flex items-center gap-3 px-5 py-3 rounded-xl transition ${
                    page === "home"
                      ? "bg-gradient-to-r from-yellow-100 to-pink-100 text-indigo-900 font-bold"
                      : "hover:bg-gradient-to-r hover:from-yellow-50 hover:to-pink-50 text-indigo-700 font-semibold"
                  }`}
                  onClick={() => setPage("home")}
                >
                  🏠 <span>Home</span>
                </button>
              </li>
              <li>
                <button
                  className="w-full flex items-center gap-3 px-5 py-3 rounded-xl hover:bg-yellow-50 text-yellow-700 font-semibold transition"
                  onClick={() => alert("Pricing: Coming soon!")}
                >
                  💰 <span>Pricing</span>
                </button>
              </li>
              <li>
                <button
                  className="w-full flex items-center gap-3 px-5 py-3 rounded-xl hover:bg-indigo-50 text-indigo-700 font-semibold transition"
                  onClick={() => alert("Help: Contact support@yourapp.com")}
                >
                  ❓ <span>Help</span>
                </button>
              </li>
              <li>
                <button
                  className="w-full flex items-center gap-3 px-5 py-3 rounded-xl hover:bg-pink-100 text-red-600 font-bold transition"
                  onClick={handleLogout}
                >
                  🚪 <span>Logout</span>
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <div className="max-w-5xl mx-auto bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 sm:p-12 border border-white/40 hover:shadow-indigo-200/50 transition-all duration-300">
        {page === "journal" && <TradeJournal strategies={strategies} />}
        {page === "strategies" && <StrategyManagerPage />}
        {page === "home" && <Home />}
      </div>
    </div>
  );
}
