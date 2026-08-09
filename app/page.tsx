"use client";

import { useState } from "react";

type Source = { url: string; title: string; quote: string };

export default function Home() {
  const [text, setText] = useState("");
  const [message, setMessage] = useState("");
  const [sources, setSources] = useState<Source[]>([]);
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    setSources([]);
    const response = await fetch("/api/generate", {
      method: "POST",
      body: JSON.stringify({ text: text }),
    });
    const data = await response.json();
    setMessage(data.message);
    setSources(data.sources ?? []);
    setLoading(false);
    setText("");
  }

  return (
    <div>
      <h1>Debate drill</h1>
      <textarea value={text} onChange={(e) => setText(e.target.value)} rows={6} cols={60} />
      <button onClick={handleClick}>Get message</button>
      <p>{loading ? "Thinking..." : message}</p>
      {!loading && sources.length > 0 && (
        <div>
          <h2>Sources</h2>
          <ul>
            {sources.map((source) => (
              <li key={source.url}>
                <a href={source.url} target="_blank" rel="noreferrer">
                  {source.title}
                </a>
                <p>{source.quote}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}