# (´꒳`) ♪ (´∀｀*) Player

A cute local music player for your browser. Pick a folder of music and play it directly — no uploads, no servers, no databases.

## Features

- Pick any local music folder (Chrome/Edge/Brave required)
- Plays MP3, FLAC, WAV, OGG, M4A, AAC
- Reads embedded metadata (title, artist, album, cover art)
- Create and manage playlists
- Group tracks by folder, collapsible sections
- Light & dark theme, persisted across sessions
- Now-playing animation on active track

## Requirements

- **Node.js 18+** (for the dev server)
- **Chrome, Edge, or Brave** (required for the folder picker API)

## Install & Run

```bash
# 1. Install dependencies
npm install

# 2. Start the dev server
npm run dev
```

Open the URL shown in the terminal (usually `http://localhost:5173`).

### Access from other devices

```bash
npx vite --host 0.0.0.0
```

Then open `https://<your-ip>:5173` from another device (self-signed cert warning — click proceed).

## Build for production

```bash
npm run build
```

Output goes to `dist/`, which can be served with any static file server.
