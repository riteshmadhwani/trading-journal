import { useEffect, useState } from "react";
import { db } from "../services/firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { useAuth } from "./useAuth";

export function useTrades() {
  const { user } = useAuth();
  const [trades, setTrades] = useState([]);
  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, "trades"), where("userId", "==", user.uid));
    const unsub = onSnapshot(q, snap => {
      setTrades(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsub();
  }, [user]);
  return trades;
}