import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react'
import { loadTracks, saveTracks, loadPlaylists as loadPlaylistsFromDB } from '../utils/db'
import AudioPlayer from '../services/audioPlayer'

const AppContext = createContext(null)

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}

export function AppProvider({ children }) {
  const [library, setLibrary] = useState([])
  const [currentTrack, setCurrentTrack] = useState(null)
  const [queue, setQueue] = useState([])
  const [queueIndex, setQueueIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(() => {
    const saved = localStorage.getItem('player-volume')
    return saved ? parseFloat(saved) : 0.8
  })
  const [shuffle, setShuffle] = useState(() => localStorage.getItem('player-shuffle') === 'true')
  const [repeatMode, setRepeatMode] = useState(() => {
    return (localStorage.getItem('player-repeat') || 'none')
  })
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [playlists, setPlaylists] = useState([])
  const [isScanning, setIsScanning] = useState(false)
  const [scanProgress, setScanProgress] = useState({ current: 0, total: 0 })
  const [browserWarning, setBrowserWarning] = useState(false)
  const [toast, setToast] = useState(null)
  const [theme, setTheme] = useState(() => localStorage.getItem('player-theme') || 'light')

  const nextTrackRef = useRef(null)
  const showToastRef = useRef(null)
  const playTrackRef = useRef(null)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('player-theme', theme)
  }, [theme])

  useEffect(() => {
    if (!window.showDirectoryPicker) {
      setBrowserWarning(true)
      if (location.protocol !== 'https:' && location.hostname !== 'localhost' && location.hostname !== '127.0.0.1') {
        setTimeout(() => showToastRef.current('This app requires a secure context (HTTPS or localhost) to access your files. Use Chrome on localhost, or set up HTTPS.'), 100)
      }
    }
  }, [])

  useEffect(() => {
    loadTracks().then(tracks => {
      if (tracks.length > 0) setLibrary(tracks)
    })
    loadPlaylistsFromDB().then(pl => {
      if (pl.length > 0) setPlaylists(pl)
    })
  }, [])

  useEffect(() => {
    localStorage.setItem('player-volume', volume)
  }, [volume])

  useEffect(() => {
    localStorage.setItem('player-shuffle', shuffle)
  }, [shuffle])

  useEffect(() => {
    localStorage.setItem('player-repeat', repeatMode)
  }, [repeatMode])

  const showToast = useCallback((message) => {
    setToast(message)
    setTimeout(() => setToast(null), 3000)
  }, [])

  showToastRef.current = showToast

  const playTrack = useCallback((track) => {
    if (!track || !track.fileRef) return
    const url = track.fileRef instanceof File
      ? URL.createObjectURL(track.fileRef)
      : track.fileRef

    const ext = track.fileRef?.name?.split('.').pop()?.toLowerCase()

    setCurrentTrack(track)
    setIsPlaying(true)
    setProgress(0)

    AudioPlayer.load(url, ext ? [ext] : undefined).then(() => {
      AudioPlayer.onEnd(() => {
        if (nextTrackRef.current) nextTrackRef.current()
      })
      AudioPlayer.onProgress((sec) => {
        setProgress(sec)
      })
      AudioPlayer.play()
    }).catch(() => {
      showToastRef.current('Could not play this file')
      if (nextTrackRef.current) nextTrackRef.current()
    })
  }, [])

  playTrackRef.current = playTrack

  const pauseTrack = useCallback(() => {
    AudioPlayer.pause()
    setIsPlaying(false)
  }, [])

  const resumeTrack = useCallback(() => {
    AudioPlayer.play()
    setIsPlaying(true)
  }, [])

  const setQueueAndPlay = useCallback((tracks, startIndex = 0) => {
    if (!tracks || tracks.length === 0) return
    const idx = startIndex >= tracks.length ? 0 : startIndex
    setQueue(tracks)
    setQueueIndex(idx)
    playTrackRef.current(tracks[idx])
  }, [])

  const nextTrack = useCallback(() => {
    setQueue(prevQueue => {
      setQueueIndex(prevIdx => {
        const q = prevQueue
        const idx = prevIdx
        const rm = repeatMode
        const sh = shuffle

        if (q.length === 0) return prevIdx

        if (rm === 'one') {
          playTrackRef.current(q[idx])
          return idx
        }

        let nextIdx
        if (sh) {
          const remaining = q.filter((_, i) => i !== idx)
          if (remaining.length === 0) return idx
          const rand = Math.floor(Math.random() * remaining.length)
          nextIdx = q.indexOf(remaining[rand])
        } else {
          nextIdx = idx + 1
          if (nextIdx >= q.length) {
            if (rm === 'all') {
              nextIdx = 0
            } else {
              return idx
            }
          }
        }

        playTrackRef.current(q[nextIdx])
        return nextIdx
      })
      return prevQueue
    })
  }, [shuffle, repeatMode])

  nextTrackRef.current = nextTrack

  const prevTrack = useCallback(() => {
    if (AudioPlayer.seek() > 3) {
      AudioPlayer.seek(0)
      return
    }
    setQueue(prevQueue => {
      setQueueIndex(prevIdx => {
        const q = prevQueue
        const idx = prevIdx
        const rm = repeatMode
        const sh = shuffle

        if (q.length === 0) return prevIdx

        let prevIdx2
        if (sh) {
          const remaining = q.filter((_, i) => i !== idx)
          if (remaining.length === 0) return idx
          const rand = Math.floor(Math.random() * remaining.length)
          prevIdx2 = q.indexOf(remaining[rand])
        } else {
          prevIdx2 = idx - 1
          if (prevIdx2 < 0) {
            prevIdx2 = rm === 'all' ? q.length - 1 : 0
          }
        }

        playTrackRef.current(q[prevIdx2])
        return prevIdx2
      })
      return prevQueue
    })
  }, [shuffle, repeatMode])

  const toggleShuffle = useCallback(() => {
    setShuffle(s => !s)
  }, [])

  const cycleRepeat = useCallback(() => {
    setRepeatMode(m => {
      if (m === 'none') return 'one'
      if (m === 'one') return 'all'
      return 'none'
    })
  }, [])

  const seekTo = useCallback((seconds) => {
    AudioPlayer.seek(seconds)
  }, [])

  const changeVolume = useCallback((v) => {
    setVolume(v)
    AudioPlayer.setVolume(v)
  }, [])

  const setScanning = useCallback((scanning, progressData) => {
    setIsScanning(scanning)
    if (progressData) setScanProgress(progressData)
  }, [])

  const setLibraryTracks = useCallback((tracks) => {
    setLibrary(tracks)
    saveTracks(tracks)
  }, [])

  const addToLibrary = useCallback((newTracks) => {
    setLibrary(prev => {
      const existing = new Set(prev.map(t => t.id))
      const toAdd = newTracks.filter(t => !existing.has(t.id))
      const merged = [...prev, ...toAdd]
      saveTracks(merged)
      return merged
    })
  }, [])

  const toggleTheme = useCallback(() => {
    setTheme(t => t === 'light' ? 'dark' : 'light')
  }, [])

  const removeTracksByFolder = useCallback((folderPath) => {
    setLibrary(prev => {
      const remaining = prev.filter(t => {
        const tf = t.folder || ''
        return tf !== folderPath && !tf.startsWith(folderPath + '/')
      })
      saveTracks(remaining)
      return remaining
    })
  }, [])

  const value = {
    library,
    currentTrack,
    queue,
    queueIndex,
    isPlaying,
    volume,
    shuffle,
    repeatMode,
    progress,
    duration,
    playlists,
    isScanning,
    scanProgress,
    browserWarning,
    toast,
    playTrack,
    pauseTrack,
    resumeTrack,
    setQueueAndPlay,
    nextTrack,
    prevTrack,
    toggleShuffle,
    cycleRepeat,
    seekTo,
    changeVolume,
    setScanning,
    setLibraryTracks,
    addToLibrary,
    removeTracksByFolder,
    theme,
    toggleTheme,
    showToast,
    setPlaylists,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
