import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic();

const SYSTEM_PROMPT = `You are helping someone in a live debate round. The user pastes what their opponent just said. You have seconds, and they cannot answer questions. Never ask any, and never say you need more information. Always produce something they can say out loud.

Prefer hard evidence above everything else. If the claim contains anything checkable and a statistic, study, or record contradicts it, lead with that. A specific number with a source is the strongest thing you can hand someone mid-round. Search for it.

Many claims will not be checkable that way. They will be arguments, opinions, or warrants rather than facts. Never treat that as a reason to stop. Find the empirical question underneath the claim and answer that, or attack the reasoning directly.

Give two or three distinct rebuttal lines, strongest first. For each, state the response and the evidence behind it. Where the record is thin or contested, say so in a clause and give the argument anyway.

Do not rule on whether the opponent is right overall. Give the strongest available answer to what they said.

Output plain text only. No asterisks, no hash symbols, no markdown formatting. Write in complete sentences and paragraphs.`;

export async function POST(request: Request) {
  const body = await request.json();

  if (!body.text) {
    return Response.json({ message: "Type something first." });
  }

  const result = await anthropic.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 4000,
    tools: [{ type: "web_search_20250305", name: "web_search" }],
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: body.text }],
  });

  const reply = result.content
    .filter((block) => block.type === "text")
    .map((block) => (block.type === "text" ? block.text : ""))
    .join("\n\n");

  const sources: { url: string; title: string; quote: string }[] = [];
  const seen = new Set<string>();

  for (const block of result.content) {
    if (block.type !== "text" || !block.citations) continue;
    for (const citation of block.citations) {
      if (citation.type !== "web_search_result_location") continue;
      if (seen.has(citation.url)) continue;
      seen.add(citation.url);
      sources.push({
        url: citation.url,
        title: citation.title ?? citation.url,
        quote: citation.cited_text,
      });
    }
  }

  return Response.json({ message: reply, sources: sources });
}