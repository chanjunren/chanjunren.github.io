# TanStack Query — Learning Plan

Recommended order for working through the notes. Each builds on the previous.

## Phase 1: Core Concepts

Read these first — they form the mental model everything else builds on.

1. **[[tanstack_query]]** — what it is, why it exists, query vs mutation vs cache
2. **[[staletime_and_gctime]]** — how the cache lifecycle works (fresh → stale → inactive → deleted)
3. **[[query_key_design]]** — key hierarchy, prefix matching, `queryOptions` factory
4. **[[tanstack_query_cheatsheet]]** — skim the API surface; come back as reference

After Phase 1 you can build a basic app with `useQuery`, `useMutation`, and `invalidateQueries`.

## Phase 2: Real-World Patterns

These cover what you hit once an app grows beyond a single page.

5. **[[tanstack_query_error_handling]]** — retries, `throwOnError`, Error Boundaries
6. **[[tanstack_query_with_zustand]]** — where server state ends and client state begins
7. **[[tanstack_query_testing]]** — testing setup, MSW mocking, common gotchas

After Phase 2 you can structure a production app with proper error handling, state separation, and tests.

## Phase 3: Advanced

Read when relevant — not required upfront.

8. **[[tanstack_query_suspense]]** — `useSuspenseQuery`, Suspense/ErrorBoundary architecture
9. **[[tanstack_query_ssr_hydration]]** — dehydrate/hydrate for Next.js or SSR frameworks
