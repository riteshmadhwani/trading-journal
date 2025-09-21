import React, { useState } from "react";
import { auth, googleProvider } from "../../services/firebase";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";

export default function LoginPage({ onRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  const handleLogin = async e => {
    e.preventDefault();
    setErr("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      setErr(error.message);
    }
  };

  const handleGoogle = async () => {
    setErr("");
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      setErr(error.message);
    }
  };

  return (
    <div>
      <form onSubmit={handleLogin}>
        <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
        <input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="Password" />
        <button type="submit">Login</button>
        <button type="button" onClick={handleGoogle}>Sign in with Google</button>
        {err && <div>{err}</div>}
      </form>
      <button onClick={onRegister}>Register</button>
    </div>
  );
}