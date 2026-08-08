"use client";

import { useState } from "react";

export default function Home() {
  const [text, setText] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    const response = await fetch("/api/generate", {
      method: "POST",
      body: JSON.stringify({ text: text }),
    });
    const data = await response.json();
    setMessage(data.message);
    setLoading(false);
    setText("");
  }

  return (
    <div>
      <h1>Debate drill</h1>
      <textarea value={text} onChange={(e) => setText(e.target.value)} rows={6} cols={60} />
      <button onClick={handleClick}>Get message</button>
      <p>{loading ? "Thinking..." : message}</p>
    </div>
  );
}