"use client";

import { useState } from "react";

export default function Home() {
  const [message, setMessage] = useState("");

  async function handleClick() {
    const response = await fetch("/api/generate");
    const data = await response.json();
    setMessage(data.message);
  }

  return (
    <div>
      <h1>Debate drill</h1>
      <button onClick={handleClick}>Get message</button>
      <p>{message}</p>
    </div>
  );
}