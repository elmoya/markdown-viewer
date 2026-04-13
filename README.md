# Markdown Viewer

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](#license)
[![Live Demo](https://img.shields.io/badge/demo-online-brightgreen.svg)](https://elmoya.github.io/markdown-viewer/)
[![React](https://img.shields.io/badge/frontend-React%2019-61dafb.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/lang-TypeScript-3178c6.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/bundler-Vite%206-646cff.svg)](https://vitejs.dev/)
[![Docker](https://img.shields.io/badge/runtime-Docker-2496ed.svg)](https://www.docker.com/)
[![GitHub Pages](https://img.shields.io/badge/deploy-GitHub%20Pages-222.svg)](https://pages.github.com/)

A tiny, zero-setup tool for turning escaped markdown strings — the kind you pull out of API responses or JSON blobs, full of literal `\n` and `\t` sequences — into a clean, readable preview.

**[Try the live demo →](https://elmoya.github.io/markdown-viewer/)**

## Why?

If you've ever copied a markdown field out of a database or a JSON payload and ended up staring at a wall of text peppered with `\n\n` and `\t`, this is for you. Paste the raw string in, get properly rendered markdown out — or the cleaned-up raw text, whichever you need.

It's especially handy when working with **n8n** and other automation platforms, where LLM or API nodes often emit markdown as escaped strings inside JSON. Drop the value in here and you can actually read it the way it was meant to look.

## Features

- **Escape-sequence aware** — Converts literal `\n`, `\t`, `\\` back into real whitespace before rendering
- **Live preview** — See the output update as you type, side-by-side or in tabs
- **Two output modes** — Rendered HTML or cleaned raw markdown
- **Light / Dark / System theme** — Auto-matches your OS by default
- **Clipboard-friendly** — One-click copy, paste, and clear on both panels
- **Remembers your setup** — Layout, theme, and mode persist across sessions
- **GitHub Flavored Markdown** — Tables, task lists, strikethrough, and more

## Run locally

```bash
docker compose up --build -d
```

Then open http://localhost:5002.

Hot reload is wired up with file polling so editing [src/](src/) reflects instantly, even on Windows.

```bash
docker compose logs -f app   # tail logs
docker compose down          # stop
```

## Deploy your own

Fork the repo, then:

1. Go to **Settings → Pages → Source** and pick **GitHub Actions**
2. Push to `main`

That's it — your copy goes live at `https://<your-username>.github.io/markdown-viewer/`. The included workflow handles the build and deploy on every push.

> If you rename the repo, update the `base` path in [vite.config.ts](vite.config.ts) to match.

## Production build

```bash
docker build --target prod -t markdown-viewer .
docker run -p 80:80 markdown-viewer
```

Serves the static bundle via Nginx.

## Tech stack

React 19 · TypeScript · Vite 6 · react-markdown · remark-gfm · Docker (Node 20 Alpine)

## License

[MIT](LICENSE) — free to use, fork, and adapt. Built as a portfolio / hobby project.
