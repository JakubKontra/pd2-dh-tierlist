# PD2 Tier List — S13 Betrayal

Interactive tier list viewer for **Project Diablo 2** Season 13 ("Betrayal") builds.

## What is this?

A fan-made interactive companion to the [PD2 Season 13 Build Tier List](https://docs.google.com/spreadsheets/d/1ipTsARndewEJaREWfcDeuCelKWpCEcFy9nrigp220_Y/edit) maintained by **Dark Humility**. The app reads the public Google Sheet live and adds filtering, side-by-side comparison, stats dashboards, and per-build detail views on top of the raw data — without modifying or reinterpreting any of the testing.

## Features

- **Live tier list** — tier cutoffs are recomputed from the sheet on every load
- **Filters** — class filter, search, retested-only, handicap toggle (raw vs adjusted placement)
- **Build detail** — top-3 T3 map runs, normalized MPM, per-map histogram
- **Compare** — pin up to 3 builds side-by-side; selection persists to `localStorage`
- **Stats dashboard** — tier distribution, class averages, top 10, density vs MPM scatter, class role scoring

## Data source & methodology

Data is pulled live from the public Google Sheet and cached in `sessionStorage` for 5 minutes.

- **Normalized MPM** = `(MPM × 200) / (Density + 100)` — rescales every run to a 200%-density baseline so builds tested on different map density rolls are directly comparable.
- **Tier placement** — average normalized MPM across a build's top 3 T3 maps is compared against tier cutoffs derived from the full dataset.
- **Handicap (`H Lvl N`)** — manual tier adjustment applied by Dark Humility for builds with fewer runs or affected by patches. Shifts placement by `±N/3` tiers. Toggle "Apply handicap" in the UI to flip between raw and adjusted placement.

See the in-app `/about` page for full methodology.

## Tech stack

- **React 19** + **TypeScript** + **Vite 8**
- **React Router v7** (client-side routing, lazy-loaded stats page)
- **Zustand v5** (persisted state for filters & compare pins)
- **Tailwind CSS v4** (via `@tailwindcss/postcss`)
- **PapaParse** (CSV parsing) + **Recharts** (charts)
- **Vitest** (unit tests for parsers)

## Getting started

Requires Node 18+ and npm.

```bash
npm install
npm run dev       # start local dev server
npm run build     # tsc -b && vite build
npm run preview   # preview production build
npm run lint      # eslint
npx vitest        # run tests
```

## Project structure

```
src/
├── pages/         Tierlist, BuildDetail, Compare, Stats, About
├── components/    BuildCard, TierRow, FilterBar, CompareFab, PinButton, ClassBadge, LoadState
├── data/          fetchSheet, parseTierlist, tiering, classMap, classScores, types
└── store/         filters (zustand), compare (zustand, persisted)
```

## Deployment

Vite builds to `dist/`. No base path is set in `vite.config.ts`, so the bundle deploys cleanly at a domain root (custom domain or static host). The app is a pure static bundle — no backend.

## Credits

- **Data, testing, methodology, tier placement** — [Dark Humility](https://docs.google.com/spreadsheets/d/1ipTsARndewEJaREWfcDeuCelKWpCEcFy9nrigp220_Y/edit). All scoring and tier decisions come from the sheet; this site is a viewer, not an editor.
- **Project Diablo 2** — [projectdiablo2.com](https://projectdiablo2.com). Fan project; not affiliated with Blizzard or the PD2 team.
- **Site built by** — [Jakub Kontra](https://jakubkontra.com), PD2 player [thejimmycz](https://www.twitch.tv/thejimmycz) on Twitch.

## Contributing

Issues and PRs welcome — especially mapping discrepancies between the sheet and the rendered tier list.
