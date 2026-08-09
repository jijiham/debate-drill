# debate-drill

A live debate assistant. The user flows a round into a grid. The app fact-checks the opponent's arguments and produces sourced rebuttals.

## How to work with Aiden

Beginner at code. Strong mathematics and physics background, Ivy League student. Pitch concepts at that level and assume no familiarity with programming conventions, tooling, or terminology. The difficulty is the arbitrary surface area, not the reasoning.

- Explain the concept before giving the command. Never append the explanation after the code.
- **Do not explain syntax.** Skip element names, bracket matching, and language mechanics unless he asks. Explain decisions: why a value is shaped a certain way, why one option over another, what breaks if it changes.
- Aiden does not write code by hand. You write it. He decides architecture, predicts behaviour before running, diagnoses failures, and must be able to read every line.
- One piece at a time. Each piece runs and is visible before the next appears.
- Define every term at first use.
- Repeat commands in full. Never say "run the commands from earlier."
- When he says he is confused, write less. If he says it twice, stop and ask what specifically is not landing.
- Prose: plain, logical, academic. No contrastive framing ("not X, but Y"). No punchlines or rhetorical flourish. Short declarative sentences that follow from each other.
- Mathematical analogies land well. Function composition, invariants, images of sets under maps.
- He pushes back directly. Course-correct immediately rather than defending the previous message.

## Priority

Ship an MVP. Prefer the shortest path to something usable in a real round over completeness.

## Stack and environment

- Next.js, TypeScript, Tailwind, App Router
- Project root: `~/code/debate-drill`
- `.env.local` holds `ANTHROPIC_API_KEY`, gitignored
- GitHub: `jijiham/debate-drill`
- Vercel redeploys on every push to main
- Editor: Cursor
- `npm run dev` runs in a dedicated terminal tab

## Current state

**app/page.tsx** — working. Textarea, button, loading indicator, paragraph showing the reply. Sends text to `/api/generate`.

**app/api/generate/route.ts** — working, unchanged from the original build. POST handler. Guards empty input, calls the Anthropic API with a system prompt instructing plain-text output, returns the text. Round trips take three to seven seconds, essentially all of it waiting on the API.

**app/flow/page.tsx** — in progress. Renders a static table. Column headings come from a `speeches` array; rows come from a hardcoded `rows` array. Not yet editable.

## Design decisions already made

**Input source.** A human types the opponent's speech, so the text already exists as text. No OCR and no speech-to-text is needed. The flow grid is built into the app rather than read from Google Sheets or Excel, because OAuth configuration teaches nothing about the product and adds polling latency. Reading an external sheet may be added later.

**No browser extension.** An extension cannot read desktop Excel, and cannot usefully read Google Sheets because the grid is drawn on a canvas. If external reading is ever needed, the Sheets API is both easier and more reliable.

**No desktop overlay for now.** Floating above other applications requires Electron or Tauri. Deferred until the product works.

**Input adapter boundary.** Everything downstream of the input receives plain text and never learns where the text came from. The program is `g ∘ h`, where `h` maps a source to text and `g` maps text to a rebuttal. Adding a second source later means writing a second `h` and changing nothing in `g`.

**Flow data shape.** Rows are argument threads. Columns are speeches.

    { id: 1, cells: ["Econ adv", "no internal link", "their ev is old"] }

Position within `cells` is the column. An empty string records that nobody answered, which preserves horizontal alignment and is itself useful information. Row `id` is permanent so React can track a row across insertion and deletion of others.

The rejected alternative was one independent list per column, where alignment is accidental and breaks as soon as one column has an extra entry.

**Known flaw, not yet fixed.** The column count is stated in two independent places: the length of `speeches` and the length of each `cells` array. Nothing forces them to agree. Whatever creates a row must derive its cell count from `speeches`.

## MVP scope

1. Flow grid at `/flow` with editable cells
2. A control that sends one cell's text to `/api/generate`
3. Rebuttal displayed beside or beneath the grid
4. Web search enabled on the API call

Explicitly out of scope for the MVP: streaming, the evidence repository, external spreadsheet integration, saving a flow across page refreshes, authentication, and styling beyond legibility.

## Next step

Make the grid cells editable. `rows` moves from a module-level constant into `useState` inside the component. React state is replaced rather than mutated, so an edit constructs a new rows array instead of assigning into the existing one.

## Change already drafted but never applied

Enable web search on the API call in `route.ts`.

Add to the `messages.create` call:

    tools: [{ type: "web_search_20250305", name: "web_search" }],

Responses then contain search blocks alongside text blocks, so the single-block extraction must be replaced:

    const reply = result.content
      .filter((block) => block.type === "text")
      .map((block) => (block.type === "text" ? block.text : ""))
      .join("\n\n");

## Already covered — do not re-explain unprompted

Client and server as roles; why the API key must stay server-side; localhost and loopback; ports; folder-based routing in the App Router; `page.tsx` versus `route.ts`; requests, responses, and HTTP methods; status codes; JSON as text and the object → text → object pattern at every network boundary; environment variables; React components as functions from state to markup; `useState` and why setters exist; controlled inputs; `"use client"`; TypeScript as erased annotations over JavaScript; `mkdir -p`, `touch`, `ls`, `cd`, `pwd`; the working directory and the project root; git's three stages; `git add .`; hot reloading and when a restart is needed; system prompts versus messages; tools versus instructions; `Array.prototype.map`; React list keys, and why rows use a permanent id while cells use an index.

## Failure patterns already encountered

- **Empty text box.** Produced a 400 from the API, a 500 from the route, an empty response body, and a JSON parse error in the browser. Four errors, one cause, and the browser reported the last link in the chain.
- **A typo mid-file stopped compilation.** The dev server kept serving the last version that compiled, so edits appeared to have no effect. The only evidence was in the terminal.
- **Reading stale terminal output.** Old errors scroll up and look current. Clear before reproducing.
- **Looking in the wrong place.** Browser errors come from `page.tsx`. Server errors come from `route.ts` and appear only in the terminal tab running `npm run dev`.

When something seems broken, check the terminal before theorising.
