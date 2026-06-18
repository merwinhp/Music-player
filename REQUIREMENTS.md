# 📋 Requirements — Local Music Player

## What you need to install

### 1. Node.js (required on both Mac & Windows)

Node.js is the JavaScript runtime that powers Vite (our build tool) and npm (package manager).

**Mac 🍎**
```
# Option A — Download installer
Visit https://nodejs.org → Download LTS version → Run the .pkg installer

# Option B — Using Homebrew (if you have it)
brew install node
```

**Windows 🪟**
```
# Option A — Download installer
Visit https://nodejs.org → Download LTS version → Run the .msi installer

# Option B — Using winget (built-in package manager)
winget install OpenJS.NodeJS.LTS
```

> ✅ After installing, open a terminal and run:
> ```
> node --version    # should show v20.x or v22.x
> npm --version     # should show 10.x or 11.x
> ```

### 2. Git (optional but recommended)

Used to clone/create the project and track changes.

**Mac:** Already installed or get it at https://git-scm.com
**Windows:** https://git-scm.com → Download → Run installer

### 3. A Chromium-based browser

The app uses the **File System Access API** to let you pick a local folder. This is only available in:

| Browser | Works? |
|---------|--------|
| ✅ **Google Chrome** | Yes |
| ✅ **Microsoft Edge** | Yes |
| ✅ **Brave** | Yes |
| ✅ **Opera** | Yes |
| ❌ Safari | No |
| ❌ Firefox | No |

---

## 🚀 How to run the project

Once Node.js is installed, open a terminal in the project folder and run:

```bash
# 1. Install all dependencies
npm install

# 2. Start the dev server
npm run dev
```

The terminal will show a URL like `http://localhost:5173` — open that in Chrome/Edge/Brave and you're good to go!

## 📦 Dependencies (auto-installed via npm)

These will be in `package.json` — no need to install them manually:

| Package | Purpose |
|---------|---------|
| `react` + `react-dom` | UI framework |
| `vite` | Dev server + bundler |
| `@vitejs/plugin-react` | React support for Vite |
| `tailwindcss` | Utility CSS framework |
| `@tailwindcss/vite` | Tailwind Vite integration |
| `howler` | Audio playback engine |
| `music-metadata-browser` | Read ID3 tags + metadata |
| `idb` | IndexedDB wrapper for playlists |
| `lucide-react` | Icons (music notes, play, pause, etc.) |

## 🔍 Verifying everything works

```bash
node --version    # ✅ should be v18+
npm --version     # ✅ should be 9+
npm run dev       # ✅ opens a local dev server
```
