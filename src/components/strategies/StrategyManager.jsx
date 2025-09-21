import React, { useState, useEffect } from "react";
import { db } from "../../services/firebase";
import { collection, addDoc, onSnapshot, deleteDoc, doc, serverTimestamp } from "firebase/firestore";
import { useAuth } from "../../hooks/useAuth";

export default function StrategyManager() {
  const { user } = useAuth();
  const [strategies, setStrategies] = useState([]);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");

  useEffect(() => {
    if (!user) return;
    const q = collection(db, "strategies");
    const unsub = onSnapshot(q, snap => {
      setStrategies(snap.docs.filter(doc => doc.data().userId === user.uid).map(doc => ({
        id: doc.id,
        ...doc.data(),
      })));
    });
    return () => unsub();
  }, [user]);

  const addStrategy = async e => {
    e.preventDefault();
    await addDoc(collection(db, "strategies"), {
      name,
      description: desc,
      userId: user.uid,
      createdAt: serverTimestamp(),
    });
    setName("");
    setDesc("");
  };

  const removeStrategy = async id => {
    await deleteDoc(doc(db, "strategies", id));
  };

  return (
    <div>
      <form onSubmit={addStrategy}>
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Strategy Name" />
        <input value={desc} onChange={e => setDesc(e.target.value)} placeholder="Description" />
        <button type="submit">Add Strategy</button>
      </form>
      <ul>
        {strategies.map(s => (
          <li key={s.id}>
            {s.name} - {s.description}
            <button onClick={() => removeStrategy(s.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}