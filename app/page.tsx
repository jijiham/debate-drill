"use client";

import { useState } from "react";

export default function Home() {
  const [text, setText] = useState("");
  const [message, setMessage] = useState("");

  async function handleClick() {
    const response = await fetch("/api/generate", {
      method: "POST",
      body: JSON.stringify({ text: text }),
    });
    const data = await response.json();
    setMessage(data.message);
  }

  return (
    <div>
      <h1>Debate drill</h1>
      <textarea value={text} onChange={(e) => setText(e.target.value)} />
      <button onClick={handleClick}>Get message</button>
      <p>{message}</p>
    </div>
  );
}