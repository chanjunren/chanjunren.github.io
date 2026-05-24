# MVM — Frontend Plan

UI for comparing Claude model outputs side-by-side with real-time streaming. Talks to MVM backend at `localhost:8080`.

Backend design doc: `backies/docs/mvm/`

---

## Code structure

```
src/pages/mvm/index.tsx                  # Page wrapper
src/components/mvm/
  mvm-view.tsx                           # Main container
  connection-banner.tsx                  # Warning when local API unreachable
  prompt-form.tsx                        # Model toggles + prompt textarea + submit
  results-grid.tsx                       # Responsive grid of result cards
  result-card.tsx                        # Single model result display (streaming text)
src/hooks/useMvm.ts                      # SSE stream consumer, loading, connection health
src/types/mvm.ts                         # TypeScript types mirroring API/SSE events
```

## Modified files

`src/constants/api.ts` — add `MVM_API_BASE = "http://localhost:8080"`.

---

## UI flow

1. On mount: hook pings `GET /api/mvm/health` (3s timeout). Fetches model list from `GET /api/mvm/models`.
2. If unreachable: amber banner — "Local API not running. Start with `make run` in backies/". Submit disabled.
3. Select models (toggle buttons rendered dynamically from `/models` response)
4. Enter prompt in textarea. Optional "Advanced" disclosure for system prompt.
5. Click "Compare" — cards appear immediately per model (from `model_start` events)
6. Text streams into each card in real-time as `token` events arrive
7. When `model_done` arrives, card footer fills in with tokens + cost + duration
8. If `model_error` arrives, card shows error state
9. Stream ends on `done` event — loading state clears

---

## SSE consumption

`EventSource` doesn't support POST. Use `fetch` + `ReadableStream`:

```typescript
const res = await fetch(`${MVM_API_BASE}/api/mvm/compare`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ prompt, models, system_prompt }),
});

const reader = res.body.getReader();
const decoder = new TextDecoder();

while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  const chunk = decoder.decode(value, { stream: true });
  // parse SSE events (split by \n\n, extract event: and data: lines)
  // dispatch by event type: model_start, token, model_done, model_error, done
}
```

State shape per model:

```typescript
{
  [model: string]: {
    text: string;        // accumulated from token events
    status: 'streaming' | 'done' | 'error';
    usage?: ArenaUsage;  // filled on model_done
    duration_ms?: number;
    total_cost_usd?: number;
    error?: string;      // filled on model_error
  }
}
```

---

## Reusable components

- `<Page>` wrapper from `src/components/ui/page.tsx`
- `Button` from `src/components/ui/button.tsx` (outline variant for model toggles)
- `Card`/`CardHeader`/`CardContent`/`CardFooter` from `src/components/ui/card.tsx`
- `useMateria` hook as fetch pattern reference (for `/models` and `/health` calls)

---

## Constraints

- **Always visible** on prod site. Shows connection banner if local API unreachable.
- **Mixed content**: prod (`https://chanjunren.github.io`) calling `http://localhost:8080`. Chrome/Firefox allow localhost as secure context exception. Safari may block — recommend running Docusaurus dev server locally.
- No new dependencies beyond what's already in the project.

---

## Future extensions

- Diff view between outputs
- Markdown rendering in result cards
- History of past comparisons
