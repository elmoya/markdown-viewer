# Markdown Viewer

A single-purpose web app that converts a markdown string value (containing literal `\n` escape sequences) into rendered HTML or raw markdown output.

## Quick Start

```bash
docker compose up --build -d
```

Open **http://localhost:5002**

## Features

- **Escape conversion** — Transforms literal `\n`, `\t`, `\\` sequences into actual characters before rendering
- **Split / Tabbed layout** — Side-by-side view or full-width tabbed view
- **Rendered / Raw output** — Toggle between formatted HTML preview and raw markdown text
- **Theming** — Light, Dark, and System (auto-detect OS preference)
- **Copy / Paste / Clear** — Clipboard actions for input and output panels
- **Persistent preferences** — Layout, theme, and output mode saved to localStorage

## Tech Stack

- React 19 + TypeScript
- Vite 6
- react-markdown + remark-gfm
- Docker (Node 20 Alpine)

## Development

```bash
# Start dev server with hot reload
docker compose up --build -d

# View logs
docker compose logs -f app

# Stop
docker compose down
```

The dev server runs inside Docker with file polling enabled for hot reload on Windows.

## Production Build

```bash
docker build --target prod -t markdown-viewer .
docker run -p 80:80 markdown-viewer
```

This builds the app and serves it via Nginx.

## GitHub Pages Deployment

The app auto-deploys to GitHub Pages on every push to `main` via the included GitHub Actions workflow.

**Setup:**

1. Push the repo to GitHub (repo name should match the `base` path in `vite.config.ts`, default: `markdown-viewer`)
2. Go to repo **Settings** → **Pages** → **Source** → select **GitHub Actions**
3. Push to `main` — the workflow builds and deploys automatically

The app will be live at `https://<your-username>.github.io/markdown-viewer/`

The Vite config uses `--mode ghpages` in the workflow to set the correct base path for GitHub Pages while keeping `/` for local development.
