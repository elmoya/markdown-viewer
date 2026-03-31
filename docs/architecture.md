# Markdown Viewer — Architecture & Documentation

## Overview

Markdown Viewer is a client-side React application that accepts a markdown-formatted string containing literal escape sequences (e.g., `\n` as two characters `\` and `n`) and converts them into properly rendered markdown. This is designed for scenarios where markdown content is stored or transmitted as a single-line string value with escaped characters.

## Use Case

The primary use case is converting markdown string values — typically from APIs, databases, JSON payloads, or log outputs — into human-readable formatted content. For example, an API response might contain:

```
## Title\\nSome **bold** text\\n\\n- Item 1\\n- Item 2
```

The app converts this into properly formatted markdown with real line breaks, then renders it as HTML.

## Architecture

### Component Hierarchy

```
App
├── Header
│   ├── ThemeToggle        (Light | Dark | System)
│   └── LayoutToggle       (Split | Tabbed)
├── [Split Layout]
│   ├── MarkdownInput      (left pane)
│   └── OutputPanel        (right pane)
│       ├── Mode toggle    (Rendered | Raw)
│       ├── CopyButton
│       ├── MarkdownPreview
│       └── RawOutput
└── [Tabbed Layout]
    ├── Tab bar            (Input | Output)
    ├── MarkdownInput      (input tab)
    └── OutputPanel        (output tab)
```

### Data Flow

```
User pastes string
       │
       ▼
   inputText (useState)
       │
       ▼
   convertEscapes()     ← Replaces \n → newline, \t → tab, \\\\ → \\
       │
       ▼
   convertedMarkdown
       │
       ├──► MarkdownPreview (react-markdown + remark-gfm → rendered HTML)
       └──► RawOutput       (plain text in <pre> block)
```

### File Structure

```
src/
├── main.tsx                    Entry point
├── App.tsx                     Root component, all state management
├── App.css                     Split/tabbed layout styles
├── index.css                   Global reset, CSS variables, markdown body styles
├── types.ts                    TypeScript type definitions
├── utils/
│   └── markdown.ts             convertEscapes() and copyToClipboard()
├── hooks/
│   ├── useTheme.ts             Theme management + OS preference detection
│   └── useLocalStorage.ts      Generic localStorage persistence hook
└── components/
    ├── Header.tsx              App title bar with layout and theme toggles
    ├── Header.css
    ├── MarkdownInput.tsx       Textarea with paste/copy/clear actions
    ├── MarkdownInput.css
    ├── MarkdownPreview.tsx     Rendered HTML output via react-markdown
    ├── MarkdownPreview.css
    ├── RawOutput.tsx           Raw converted markdown in <pre> block
    ├── RawOutput.css
    ├── OutputPanel.tsx         Output container with mode toggle and copy
    ├── OutputPanel.css
    ├── ThemeToggle.tsx         Three-way toggle (Light/Dark/System)
    ├── ThemeToggle.css
    ├── LayoutToggle.tsx        Two-way toggle (Split/Tabbed)
    ├── CopyButton.tsx          Reusable clipboard copy button
    └── CopyButton.css
```

## State Management

All state lives in `App.tsx`. No state library is needed at this scale.

| State | Type | Default | Persisted | Purpose |
|-------|------|---------|-----------|---------|
| `inputText` | `string` | `""` | No | Raw user input |
| `theme` | `"light" \| "dark" \| "system"` | `"system"` | localStorage | Color theme |
| `layout` | `"split" \| "tabbed"` | `"split"` | localStorage | Layout mode |
| `outputMode` | `"rendered" \| "raw"` | `"rendered"` | localStorage | Output display |
| `activeTab` | `"input" \| "output"` | `"input"` | No | Active tab (tabbed mode) |

### Why no state library?

Five state variables with no shared mutable state and no async data fetching. `useState` + a custom `useLocalStorage` hook covers everything. Adding Context, Zustand, or Redux would add complexity with no benefit.

## Theming

Themes are implemented with CSS custom properties on the `<html>` element via `data-theme` attribute.

```
:root, [data-theme="light"]   → light palette
[data-theme="dark"]           → dark palette
```

The `useTheme` hook:
1. Reads/writes theme preference to localStorage
2. Sets `data-theme` on `document.documentElement`
3. Listens to `matchMedia('(prefers-color-scheme: dark)')` for system mode changes

### CSS Variables

| Variable | Purpose |
|----------|---------|
| `--bg-primary` | Main background |
| `--bg-secondary` | Header/panel backgrounds |
| `--bg-input` | Textarea background |
| `--text-primary` | Main text color |
| `--text-secondary` | Muted text color |
| `--border-color` | Borders and dividers |
| `--accent-color` | Active toggle, links |
| `--code-bg` | Code block background |
| `--table-border` | Table border color |
| `--table-stripe` | Alternating table row |
| `--toggle-active-bg` | Active toggle button |
| `--toggle-active-text` | Active toggle text |

## Core Logic: Escape Conversion

The `convertEscapes()` function in `src/utils/markdown.ts` handles the primary transformation:

```typescript
const escapeMap: Record<string, string> = {
  '\\n': '\n',
  '\\t': '\t',
  '\\\\': '\\',
}

function convertEscapes(input: string): string {
  return input.replace(/\\\\|\\n|\\t/g, (match) => escapeMap[match])
}
```

The regex processes `\\\\` first (literal backslash) to prevent double-conversion. This runs on every render — it's O(n) on string length and completes in under 1ms for typical input sizes.

## Markdown Rendering

Uses `react-markdown` with `remark-gfm` plugin for GitHub Flavored Markdown support:

- **Standard:** headings, bold, italic, links, images, code blocks, blockquotes, lists, horizontal rules
- **GFM extensions:** tables, strikethrough, task lists, autolinks

`react-markdown` renders directly to React components — no `dangerouslySetInnerHTML`, which avoids XSS risk from user-pasted content.

## Docker Setup

### Development

```yaml
services:
  app:
    build:
      context: .
      target: dev
    ports:
      - "5002:5002"
    volumes:
      - .:/app              # Mount source for hot reload
      - /app/node_modules   # Preserve container's node_modules
```

Vite is configured with `usePolling: true` for file watching because Docker volume mounts on Windows don't emit native filesystem events.

### Production

The Dockerfile uses a multi-stage build:

1. **base** — Install dependencies
2. **dev** — Run Vite dev server (used by docker-compose)
3. **build** — Run `tsc` + `vite build`
4. **prod** — Copy built assets to Nginx Alpine image

### IDE Type Resolution

Since `node_modules` lives inside the Docker container, the host IDE can't resolve TypeScript types. To fix this, copy modules from the container:

```bash
docker compose exec app sh -c "cd /app && tar cf /tmp/nm.tar --dereference node_modules"
docker compose cp app:/tmp/nm.tar ./nm.tar
tar xf nm.tar
rm nm.tar
```

This extracts `node_modules` to the host with symlinks dereferenced (required for Windows).

## GitHub Pages Deployment

The app can be deployed as a static site to GitHub Pages using the included GitHub Actions workflow at `.github/workflows/deploy.yml`.

### How It Works

1. On push to `main` (or manual trigger), the workflow runs:
   - Checks out code
   - Installs Node 20 + dependencies
   - Builds with `npx vite build --mode ghpages`
   - Uploads the `dist/` folder as a Pages artifact
   - Deploys to GitHub Pages

2. The `--mode ghpages` flag tells Vite to use `/markdown-viewer/` as the base path (configured in `vite.config.ts`):

```typescript
export default defineConfig(({ mode }) => ({
  base: mode === 'ghpages' ? '/markdown-viewer/' : '/',
  // ...
}))
```

This ensures asset URLs are correct on GitHub Pages (`/<repo-name>/assets/...`) while keeping `/` for local Docker development.

### Setup Steps

1. Push repo to GitHub as `markdown-viewer`
2. In repo **Settings** → **Pages** → **Source** → select **GitHub Actions**
3. Push to `main` — auto-deploys

If the repo name differs from `markdown-viewer`, update the base path in `vite.config.ts` accordingly.

### Workflow Configuration

The workflow uses:
- `actions/upload-pages-artifact@v3` — packages the build output
- `actions/deploy-pages@v4` — deploys to the Pages environment
- Concurrency group `pages` with `cancel-in-progress: true` to avoid overlapping deploys

## Responsive Design

- **Split mode** at viewport width < 768px: panes stack vertically instead of side-by-side
- **Tabbed mode** provides a full-width alternative at any viewport size

## Dependencies

### Production (3 beyond React)

| Package | Purpose |
|---------|---------|
| `react-markdown` | Renders markdown as React components |
| `remark-gfm` | GitHub Flavored Markdown support (tables, etc.) |

### Development

| Package | Purpose |
|---------|---------|
| `vite` | Build tool and dev server |
| `@vitejs/plugin-react` | React Fast Refresh for HMR |
| `typescript` | Type checking |
| `@types/react`, `@types/react-dom` | React type definitions |
