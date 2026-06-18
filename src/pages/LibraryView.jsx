import { useState, useMemo } from 'react'
import { Search, ArrowUpDown, Folder, ChevronDown, ChevronRight, X } from 'lucide-react'
import { useApp } from '../context/AppContext'
import TrackRow from '../components/TrackRow'
import FolderPicker from '../components/FolderPicker'

function formatFolderPath(folder) {
  return folder ? `/${folder}` : '/'
}

export default function LibraryView() {
  const { library, isScanning, scanProgress, currentTrack, isPlaying, setQueueAndPlay, pauseTrack, resumeTrack, removeTracksByFolder, showToast } = useApp()
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('title')
  const [collapsed, setCollapsed] = useState({})

  const filtered = useMemo(() => {
    let result = library
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(t =>
        (t.title || '').toLowerCase().includes(q) ||
        (t.artist || '').toLowerCase().includes(q) ||
        (t.album || '').toLowerCase().includes(q)
      )
    }
    result = [...result]
    switch (sortBy) {
      case 'artist':
        result.sort((a, b) => (a.artist || '').localeCompare(b.artist || ''))
        break
      case 'album':
        result.sort((a, b) => (a.album || '').localeCompare(b.album || ''))
        break
      case 'duration':
        result.sort((a, b) => (a.duration || 0) - (b.duration || 0))
        break
      default:
        result.sort((a, b) => (a.title || '').localeCompare(b.title || ''))
    }
    return result
  }, [library, searchQuery, sortBy])

  const grouped = useMemo(() => {
    const groups = {}
    for (const track of filtered) {
      const folder = track.folder || ''
      if (!groups[folder]) groups[folder] = []
      groups[folder].push(track)
    }
    return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b))
  }, [filtered])

  const sortOptions = [
    { value: 'title', label: 'Title' },
    { value: 'artist', label: 'Artist' },
    { value: 'album', label: 'Album' },
    { value: 'duration', label: 'Duration' },
  ]

  const handlePlayTrack = (track) => {
    if (currentTrack?.id === track.id) {
      if (isPlaying) {
        pauseTrack()
      } else {
        resumeTrack()
      }
      return
    }
    const idx = library.findIndex(t => t.id === track.id)
    if (idx >= 0) {
      setQueueAndPlay(library, idx)
    }
  }

  const toggleCollapse = (folder) => {
    setCollapsed(prev => ({ ...prev, [folder]: !prev[folder] }))
  }

  const handleRemoveFolder = (folder) => {
    const label = formatFolderPath(folder)
    removeTracksByFolder(folder)
    showToast(`Removed ${label}`)
  }

  if (isScanning) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="text-6xl mb-4 animate-spin">🎵</div>
        <p className="text-lg font-bold text-kawaii-text">Scanning your music...</p>
        {scanProgress.total > 0 && (
          <p className="text-sm text-gray-400 mt-1">
            {scanProgress.current} / {scanProgress.total} files
          </p>
        )}
        <div className="w-64 h-2 rounded-full mt-4 overflow-hidden" style={{ backgroundColor: 'var(--slider-track)' }}>
          <div
            className="h-full bg-kawaii-pink rounded-full transition-all duration-300"
            style={{ width: `${scanProgress.total > 0 ? (scanProgress.current / scanProgress.total) * 100 : 0}%` }}
          />
        </div>
      </div>
    )
  }

  if (library.length === 0) return null

  return (
    <div>
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--track-muted)' }} />
          <input
            type="text"
            placeholder="Search songs, artists, albums..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-full focus:outline-none focus:ring-2 focus:ring-kawaii-pink/40 focus:border-transparent
              text-sm text-kawaii-text transition-all"
            style={{ backgroundColor: 'var(--input-bg)', borderColor: 'var(--divider)', color: 'var(--color-kawaii-text)' }}
          />
        </div>
        <div className="flex items-center gap-2">
          <ArrowUpDown size={16} style={{ color: 'var(--track-muted)' }} />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-sm rounded-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-kawaii-pink/40 text-kawaii-text"
            style={{ backgroundColor: 'var(--input-bg)', borderColor: 'var(--divider)' }}
          >
            {sortOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        <FolderPicker />
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16" style={{ color: 'var(--track-muted)' }}>
          <p>No results for "{searchQuery}"</p>
        </div>
      )}

      {grouped.map(([folder, tracks]) => {
        const isCollapsed = collapsed[folder]
        return (
          <div key={folder} className="mb-4">
            <div
              className="flex items-center gap-2 px-2 py-2 rounded-lg text-sm font-bold transition-all group/collapse"
              style={{ color: 'var(--folder-text)' }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--folder-hover)' }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent' }}
            >
              <button
                onClick={() => toggleCollapse(folder)}
                className="p-0.5 rounded transition-all"
                style={{ color: 'var(--folder-text)' }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--folder-hover)' }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent' }}
              >
                {isCollapsed ? <ChevronRight size={16} /> : <ChevronDown size={16} />}
              </button>
              <Folder size={16} className="text-kawaii-pink shrink-0" />
              <span className="truncate text-kawaii-text">{formatFolderPath(folder)}</span>
              <span className="text-xs font-normal" style={{ color: 'var(--track-muted)' }}>{tracks.length}</span>
              <button
                onClick={() => handleRemoveFolder(folder)}
                className="ml-auto p-1 rounded opacity-0 group-hover/collapse:opacity-100 transition-all hover:text-red-400"
                title="Remove folder"
                style={{ color: 'var(--track-muted)' }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--folder-hover)' }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent' }}
              >
                <X size={14} />
              </button>
            </div>
            {!isCollapsed && (
              <div className="space-y-0.5 mt-1">
                {tracks.map(track => (
                  <TrackRow
                    key={track.id}
                    track={track}
                    onPlay={() => handlePlayTrack(track)}
                    isActive={currentTrack?.id === track.id}
                  />
                ))}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
