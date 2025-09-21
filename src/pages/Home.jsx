import React from "react";
import { useAuth } from "../hooks/useAuth";
export default function Home() {
  const { user } = useAuth();
  return (
    <div>
      <h1>Trading Journal</h1>
      {user ? <div>Welcome, {user.displayName || user.email}</div> : <div>Please log in</div>}
    </div>
  );
}