import React, { useState } from "react";
import { auth } from "../../services/firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { db } from "../../services/firebase";
import { setDoc, doc, serverTimestamp } from "firebase/firestore";

export default function RegisterPage({ onLogin }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  const handleRegister = async e => {
    e.preventDefault();
    setErr("");
    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCred.user, { displayName: name });
      await setDoc(doc(db, "userdetails", userCred.user.uid), {
        name,
        email,
        createdAt: serverTimestamp(),
        uid: userCred.user.uid,
      });
    } catch (error) {
      setErr(error.message);
    }
  };

  return (
    <div>
      <form onSubmit={handleRegister}>
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Name" />
        <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
        <input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="Password" />
        <button type="submit">Register</button>
        {err && <div>{err}</div>}
      </form>
      <button onClick={onLogin}>Back to Login</button>
    </div>
  );
}