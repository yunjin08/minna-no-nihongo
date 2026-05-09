# Minna no Nihongo — Interactive Study Guide

A Progressive Web App for learning Japanese vocabulary from chapters 1–8 of *Minna no Nihongo I, 2nd Edition (Romanized Version)*. Fully client-side, no login, works offline.

## Features

- 8 chapters (DAI-1 KA → DAI-8 KA), ~440 words and ~170 example sentences hand-curated from the UP Cebu Vocabulary Translation Guide PDF.
- 4 quiz modes: multiple choice (EN), reverse multiple choice (RO), listening, flashcards.
- Progress tracking with day streak, per-chapter stats, and last 10 quiz scores.
- Global search with chapter and learned-state filters.
- Web Speech API pronunciation (uses your device's built-in `ja-JP` voice).
- Installable PWA, dark/light themes, font scaling, audio speed control.
- All data stored locally in `localStorage`.

## Develop

```bash
npm install
npm run dev          # http://localhost:5173
npm run build
npm run preview
```

## Deploy

Push to a Netlify-connected git repo, or drag the `dist/` folder into Netlify. The included `netlify.toml` handles SPA routing.

## Credits

Created by [Your Group Names] for **Japanese 10 — Elementary Japanese I**, 1st Semester AY 2024–2025, University of the Philippines Cebu, under Prof. Ma. Rosario Ballescas.

Vocabulary source: *Minna no Nihongo I, 2nd Edition (Romanized Version)* — UP Cebu Students' Vocabulary Translation Guide.
