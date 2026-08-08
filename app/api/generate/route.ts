import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic();

export async function POST(request: Request) {
  const body = await request.json();

  if (!body.text) {
    return Response.json({ message: "Type something first." });
  }

  const result = await anthropic.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 1000,
    system: "You are helping someone in a live debate. The user will paste what their opponent just said. Identify any factual claims and state whether each is accurate, then suggest one strong counterpoint. Be concise.\n\nIMPORTANT: Output plain text only. Never use asterisks, hash symbols, or any markdown formatting. Write in complete sentences and paragraphs.",
    messages: [{ role: "user", content: body.text }],
  });

  const reply = result.content[0].type === "text" ? result.content[0].text : "";

  return Response.json({ message: reply });
}