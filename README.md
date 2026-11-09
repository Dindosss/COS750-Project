# COS212 Binary Trees Tutor

Client-only, self-paced binary-trees learning prototype. It stores progress and text-size preference in browser local storage only.

## Run

```bash
npm install
npm run dev
```

Run `npm test` for the domain fixture tests and `npm run build` for a production diagnostic build.

## Extending it

- `src/domain` contains immutable tree operations and UI-independent traversal algorithms.
- Add lessons and glossary entries in `src/content/lesson.ts`; assessment items live in `src/content/questions.ts`.
- The focused interactive views live in `src/components/cos212`; the shell and learning stages are in `src/routes/index.tsx`.
