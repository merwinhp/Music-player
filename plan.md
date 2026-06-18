# 🎵 Local Music Player Website — Plan

## Overview
A fully client-side web app that plays music files **directly from the user's local folders** in the browser. No server, no uploads — just pick a folder and play.

## Goals
- Select a local music folder and auto-scan all audio files
- Search/filter music (by filename, artist, album, etc.)
- Create and manage playlists
- Full player controls: play/pause, next, previous, shuffle, repeat one, repeat playlist
- Cute anime-style UI (kawaii aesthetic)
- All data stays local (playlists saved in browser storage)

## ✅ Chosen Tech Stack (Option 2)
| Layer | Choice |
|-------|--------|
| Framework | **React** (component-based UI) |
| Build tool | **Vite** (fast dev server + bundler) |
| Styling | **Tailwind CSS** (utility-first + easy theming) |
| Audio engine | **Howler.js** (better audio control) |
| Folder picker | **File System Access API** (`showDirectoryPicker()`) |
| Metadata | TagLib via WebAssembly or `music-metadata-browser` |
| Playlist storage | **IndexedDB** via `idb` wrapper |
| Icons | Lucide React + custom kawaii SVGs |
| Fonts | Google Fonts (cute rounded Japanese-style) |

## Features — Detailed

### 1. Folder Selection & Scanning
- User clicks "Pick Folder" → browser opens native folder picker
- Recursively scan for audio files (.mp3, .flac, .wav, .ogg, .m4a, .aac)
- Read metadata (title, artist, album, cover art) via music-metadata-browser
- Cache metadata in IndexedDB for faster re-loads

### 2. Music Library / Search
- Display all scanned songs in a list/grid
- Search bar — filter by song title, artist, album name
- Sort by name, artist, album, duration

### 3. Playlists
- Create new playlists (named)
- Add/remove songs to/from a playlist
- Select any playlist to play from it
- Playlists saved in IndexedDB (persist across sessions)

### 4. Now Playing / Player Controls
- **Play / Pause**
- **Next / Previous** track
- **Progress bar** (clickable scrub)
- **Volume control**
- **Shuffle** — randomize the current queue
- **Repeat One** — loop the current track
- **Repeat All** — loop the entire queue/playlist
- Show song info: title, artist, album art (if embedded)

### 5. UI Design — Cute Anime Style
- Pastel color palette (pinks, lavenders, soft blues)
- Rounded corners, soft shadows
- Custom player controls with chibi/kawaii icons (SVG or emoji)
- Maybe a cute mascot or decorative elements (floating music notes, sparkles)
- Responsive layout (works on desktop & tablet)
- Japanese/Kawaii font accents

## Pages / Views
1. **Library View** — all scanned songs with search
2. **Playlist View** — list of playlists + songs inside a selected one
3. **Now Playing / Player View** — currently playing track with controls (could be a fixed bottom bar + expanded view)

## Browser Support
- **Full support:** Chrome, Edge, Brave (Chromium-based → have File System Access API)
- **Not supported:** Safari, Firefox (no folder picker API yet)

## Requirements
See `REQUIREMENTS.md` for what to install on Mac and Windows.

## Timeline
1. **Setup** — scaffold Vite + React + Tailwind project
2. **Core** — folder picker + file scanner + audio playback with Howler.js
3. **Metadata** — music-metadata-browser integration for artist/album/cover
4. **Playlists** — IndexedDB CRUD for playlists
5. **Player UI** — all controls (next, prev, shuffle, repeat)
6. **UI Polish** — anime/cute theme, animations, icons
7. **Test & Refine** — handle edge cases, browser compatibility
