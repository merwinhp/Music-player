# 🎵 Local Music Player — Task Breakdown

> AI-friendly task list. Each task is small, self-contained, and has a clear done condition.
> Work through phases in order. Do not skip ahead.

---

## PHASE 1 — Project Scaffold

### TASK-001: Initialize Vite + React project
- Run `npm create vite@latest music-player -- --template react`
- Confirm `src/App.jsx` and `vite.config.js` exist
- **Done when:** `npm run dev` starts without errors

### TASK-002: Install and configure Tailwind CSS
- Install: `npm install -D tailwindcss postcss autoprefixer`
- Run: `npx tailwindcss init -p`
- Add `./src/**/*.{js,jsx}` to `content` in `tailwind.config.js`
- Add Tailwind directives to `src/index.css`
- **Done when:** A test element with `className="text-pink-400"` renders pink

### TASK-003: Install all project dependencies
- `npm install howler`
- `npm install music-metadata-browser`
- `npm install idb`
- `npm install lucide-react`
- **Done when:** All packages appear in `package.json` with no install errors

### TASK-004: Set up Google Fonts (kawaii style)
- Add `<link>` tags to `index.html` for **Nunito** (body) and **M PLUS Rounded 1c** (accents)
- Apply fonts in `tailwind.config.js` under `theme.extend.fontFamily`
- **Done when:** Default body text uses Nunito

### TASK-005: Define global color theme in Tailwind config
- Add custom colors under `theme.extend.colors`:
  - `kawaii-pink: #FFB7C5`
  - `kawaii-lavender: #C9B8FF`
  - `kawaii-blue: #B8DEFF`
  - `kawaii-bg: #FFF0F5`
  - `kawaii-surface: #FFFFFF`
  - `kawaii-text: #4A3F55`
- **Done when:** These color names work in className props

---

## PHASE 2 — App Shell & Layout

### TASK-006: Create main app layout with sidebar + content area
- Edit `src/App.jsx` to render a two-column layout:
  - Left: fixed sidebar (navigation)
  - Right: scrollable main content area
- Use Tailwind for layout (`flex`, `h-screen`, `overflow-hidden`)
- **Done when:** Two columns visible with placeholder text

### TASK-007: Build Sidebar component
- Create `src/components/Sidebar.jsx`
- Items: **Library**, **Playlists**
- Highlight active nav item
- Kawaii style: pastel background, rounded pill active state
- **Done when:** Clicking items logs to console (routing done later)

### TASK-008: Build bottom Player Bar component (empty shell)
- Create `src/components/PlayerBar.jsx`
- Fixed to bottom of screen, full width
- Contains placeholder areas for: song info (left), controls (center), volume (right)
- Kawaii style: soft white bar with pink accent top border
- **Done when:** Bar is visible at bottom, does not overlap content

### TASK-009: Set up React Context for global app state
- Create `src/context/AppContext.jsx`
- Initial state: `{ currentTrack: null, queue: [], isPlaying: false, volume: 0.8 }`
- Export `AppProvider` and `useApp` hook
- Wrap `App.jsx` with `AppProvider`
- **Done when:** `useApp()` returns state without errors in any child component

---

## PHASE 3 — Folder Picker & File Scanner

### TASK-010: Build FolderPicker component
- Create `src/components/FolderPicker.jsx`
- Button: "📂 Pick Music Folder"
- On click: call `window.showDirectoryPicker()`
- Log the directory handle to console on success
- Show error message if API not supported (non-Chromium browser)
- **Done when:** Clicking the button opens the OS folder picker

### TASK-011: Write recursive folder scanner utility
- Create `src/utils/scanFolder.js`
- Function: `scanFolder(directoryHandle) → Promise<File[]>`
- Recursively walks directory tree
- Filters for extensions: `.mp3`, `.flac`, `.wav`, `.ogg`, `.m4a`, `.aac`
- Returns flat array of `File` objects
- **Done when:** Unit-testable in console; returns correct file list for a test folder

### TASK-012: Write metadata reader utility
- Create `src/utils/readMetadata.js`
- Import `parseBlob` from `music-metadata-browser`
- Function: `readMetadata(file) → Promise<TrackMeta>`
- Returns object: `{ id, title, artist, album, duration, coverArt (base64 or null), fileRef }`
- Fallback: use filename as title if tag is missing
- **Done when:** Calling with a real `.mp3` returns a correct metadata object

### TASK-013: Set up IndexedDB schema with `idb`
- Create `src/utils/db.js`
- Open DB named `music-player-db` version 1
- Object stores:
  - `tracks` — keyPath `id`
  - `playlists` — keyPath `id`
- Export `db` promise
- **Done when:** DB opens without errors; visible in browser DevTools → Application → IndexedDB

### TASK-014: Write track cache functions
- Add to `src/utils/db.js`:
  - `saveTracks(tracks[])` — bulk put into `tracks` store
  - `loadTracks()` — return all tracks from store
  - `clearTracks()` — clear all tracks
- **Done when:** Save → refresh → load returns same data

### TASK-015: Wire FolderPicker → scan → metadata → save to DB
- In `FolderPicker.jsx` (or a parent):
  1. Call `scanFolder()` on picked directory handle
  2. For each file, call `readMetadata()`
  3. Save all tracks to IndexedDB via `saveTracks()`
  4. Update AppContext `library` state with the track array
- Show progress: "Scanning… (42 / 120 files)"
- **Done when:** Picking a folder populates state and DB with track objects

---

## PHASE 4 — Library View

### TASK-016: Build LibraryView page component
- Create `src/pages/LibraryView.jsx`
- Reads `library` from AppContext
- Renders list of `TrackRow` components
- Shows empty state if no tracks loaded: "No music yet — pick a folder! 🎵"
- **Done when:** Track list renders after folder pick

### TASK-017: Build TrackRow component
- Create `src/components/TrackRow.jsx`
- Props: `track`, `onPlay`, `isActive`
- Displays: cover art thumbnail (or default note emoji), title, artist, album, duration
- Highlight row if `isActive`
- Kawaii style: hover state with soft pink background, rounded corners
- **Done when:** Row renders correctly for a track with and without cover art

### TASK-018: Build SearchBar component
- Create `src/components/SearchBar.jsx`
- Controlled input, calls `onChange(query)` prop on each keystroke
- Kawaii style: rounded pill shape, pink focus ring
- **Done when:** Typing triggers the callback with current value

### TASK-019: Wire search/filter into LibraryView
- Filter `library` array in LibraryView by search query
- Match against: `title`, `artist`, `album` (case-insensitive)
- Show "No results for '…'" if filtered list is empty
- **Done when:** Typing in search bar filters visible tracks in real time

### TASK-020: Add sort controls to LibraryView
- Add sort dropdown or button group: **Title**, **Artist**, **Album**, **Duration**
- Sort the displayed (filtered) list accordingly
- Default sort: by Title A→Z
- **Done when:** Clicking sort options reorders the list

---

## PHASE 5 — Audio Playback

### TASK-021: Create AudioPlayer service using Howler.js
- Create `src/services/audioPlayer.js`
- Singleton that wraps `Howl`
- Functions: `load(fileUrl)`, `play()`, `pause()`, `stop()`, `seek(seconds)`, `setVolume(0–1)`
- Callbacks: `onEnd`, `onProgress(seconds)`
- **Done when:** Calling `load(url).then(play)` plays audio in browser

### TASK-022: Wire track play into AppContext
- Add to AppContext: `playTrack(track)`, `pauseTrack()`, `resumeTrack()`
- `playTrack` creates an object URL from `track.fileRef`, passes to AudioPlayer
- Update `isPlaying`, `currentTrack` state accordingly
- **Done when:** Calling `playTrack(track)` plays audio and updates context state

### TASK-023: Implement queue management in AppContext
- Add state: `queue: []`, `queueIndex: 0`
- Functions:
  - `setQueue(tracks[], startIndex)` — load new queue
  - `nextTrack()` — advance index, play next
  - `prevTrack()` — go back, play previous
- **Done when:** `nextTrack()` automatically plays the next item in the queue

### TASK-024: Clicking a track in LibraryView starts playback
- In TrackRow `onPlay`: call `setQueue(library, trackIndex)` then `playTrack(track)`
- **Done when:** Double-clicking (or single-click play button) on a track plays it

---

## PHASE 6 — Player Controls

### TASK-025: Build Play/Pause button
- In `PlayerBar.jsx`, add a play/pause toggle button
- Reads `isPlaying` from AppContext
- Calls `pauseTrack()` or `resumeTrack()` on click
- Kawaii style: large rounded button, pink fill when playing
- **Done when:** Button correctly toggles playback

### TASK-026: Build Next and Previous buttons
- Add Prev / Next buttons to PlayerBar
- Call `prevTrack()` / `nextTrack()` from AppContext
- **Done when:** Buttons change the current track

### TASK-027: Build progress/seek bar
- Show current position and total duration (e.g. `1:23 / 3:45`)
- Clickable/draggable range input maps to `seek(seconds)`
- Update position via AudioPlayer's `onProgress` callback every second
- **Done when:** Bar updates in real time; clicking a position seeks correctly

### TASK-028: Build volume slider
- Range input 0–100 mapped to 0.0–1.0
- Calls `audioPlayer.setVolume()` on change
- Default: 80%
- **Done when:** Slider changes playback volume

### TASK-029: Implement Shuffle mode
- Add `shuffle: false` to AppContext
- Toggle function: `toggleShuffle()`
- When enabled, `nextTrack()` picks a random unplayed index
- Shuffle button in PlayerBar highlights when active
- **Done when:** Enabling shuffle randomizes next track selection

### TASK-030: Implement Repeat modes
- Add `repeatMode: 'none' | 'one' | 'all'` to AppContext
- Toggle cycles through: none → one → all → none
- `repeatMode = 'one'`: replay current track on end
- `repeatMode = 'all'`: wrap queue around on end
- Repeat button in PlayerBar shows current mode (icon or label)
- **Done when:** Each repeat mode behaves correctly at track end

### TASK-031: Show current track info in PlayerBar
- Display: cover art thumbnail, title, artist
- Pull from `currentTrack` in AppContext
- Show placeholder art (music note SVG) if no cover art
- **Done when:** PlayerBar updates when track changes

---

## PHASE 7 — Playlists

### TASK-032: Write playlist CRUD functions in db.js
- Add to `src/utils/db.js`:
  - `createPlaylist(name) → playlist object`
  - `loadPlaylists() → playlist[]`
  - `addTrackToPlaylist(playlistId, track)`
  - `removeTrackFromPlaylist(playlistId, trackId)`
  - `deletePlaylist(playlistId)`
- Each playlist: `{ id, name, trackIds[], createdAt }`
- **Done when:** All functions work; data persists across page refresh

### TASK-033: Add playlist state to AppContext
- State: `playlists: []`
- Load playlists from DB on app mount
- Actions: `createPlaylist`, `deletePlaylist`, `addToPlaylist`, `removeFromPlaylist`
- **Done when:** Playlists load on startup and update reactively

### TASK-034: Build PlaylistView page component
- Create `src/pages/PlaylistView.jsx`
- Left panel: list of playlists + "＋ New Playlist" button
- Right panel: tracks inside selected playlist
- **Done when:** Selecting a playlist shows its tracks

### TASK-035: Build CreatePlaylist modal/dialog
- Input for playlist name + confirm button
- On submit: call `createPlaylist(name)` from AppContext
- Close on success or cancel
- Kawaii style: centered modal, soft shadow, pink confirm button
- **Done when:** New playlist appears in the list after creation

### TASK-036: Add "Add to Playlist" option to TrackRow
- Right-click or "⋯" button on TrackRow opens a small menu
- Menu lists all existing playlists
- Clicking a playlist calls `addToPlaylist(playlistId, track)`
- **Done when:** Tracks can be added to playlists from LibraryView

### TASK-037: Enable playing a full playlist
- In PlaylistView, "▶ Play All" button
- Calls `setQueue(playlistTracks, 0)` then `playTrack(firstTrack)`
- **Done when:** Play All button plays playlist tracks in order

---

## PHASE 8 — UI Polish (Kawaii Theme)

### TASK-038: Add kawaii decorative background
- Subtle repeating pattern or gradient in `kawaii-bg` color
- Optional: floating music note SVGs as CSS background-image
- **Done when:** App background feels soft and themed

### TASK-039: Polish all buttons with kawaii style
- All primary buttons: `bg-kawaii-pink`, `rounded-full`, `shadow-sm`
- Hover: slight scale-up (`hover:scale-105 transition`)
- Active: slight press-down effect
- **Done when:** Buttons feel lively and cute

### TASK-040: Add cover art placeholder SVG
- Create `src/assets/default-cover.svg` — a cute music note or chibi speaker
- Use in all places where cover art is null
- **Done when:** Every track without embedded art shows the cute placeholder

### TASK-041: Add loading spinner for folder scan
- Show a kawaii spinner (rotating music note or star) during scanning
- Hide once scanning is complete
- **Done when:** Spinner appears and disappears correctly during scan

### TASK-042: Add smooth transitions and animations
- Track rows: fade-in when list first loads (`animate-fade-in`)
- PlayerBar: slide-up on first play
- Modal: scale-in on open, scale-out on close
- Use Tailwind `transition`, `duration-200`, `ease-in-out`
- **Done when:** UI transitions feel smooth, not jarring

### TASK-043: Make layout responsive for tablet
- Test at 768px width
- Sidebar collapses to icon-only below 1024px
- PlayerBar controls stack if needed
- Track rows truncate long text with `truncate`
- **Done when:** App is usable on a 768px tablet screen

---

## PHASE 9 — Edge Cases & Final Polish

### TASK-044: Handle unsupported browser gracefully
- On app load, check `if (!window.showDirectoryPicker)`
- Show a banner: "⚠️ Please use Chrome, Edge, or Brave to use this app"
- Hide folder picker button
- **Done when:** Firefox/Safari users see the warning instead of a broken button

### TASK-045: Handle tracks with missing metadata gracefully
- If `title` missing → use filename (strip extension)
- If `artist` missing → show "Unknown Artist"
- If `album` missing → show "Unknown Album"
- If `duration` is 0 or NaN → show `--:--`
- **Done when:** No track row shows undefined or blank fields

### TASK-046: Handle audio playback errors
- Add `onPlayError` callback to AudioPlayer
- Show a small toast notification: "⚠️ Could not play this file"
- Automatically skip to next track
- **Done when:** Corrupted or unsupported file does not freeze the player

### TASK-047: Persist last-played track and volume across sessions
- On app exit/unload: save `{ lastTrackId, volume, repeatMode, shuffle }` to `localStorage`
- On app load: restore these values into AppContext
- **Done when:** Refreshing the page restores volume and last track info

### TASK-048: Final review pass
- Remove all `console.log` debug statements
- Test full flow: pick folder → play track → next/prev → create playlist → add tracks → play playlist
- Verify no layout breaks at 1280px, 1024px, 768px widths
- **Done when:** All core features work end-to-end without console errors
