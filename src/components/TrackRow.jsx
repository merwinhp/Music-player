import { useState } from 'react'
import { Play, Music, MoreVertical } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { addTrackToPlaylist } from '../utils/db'

function formatDuration(sec) {
  if (!sec || isNaN(sec) || sec <= 0) return '--:--'
  const m = Math.floor(sec / 60)
  const s = Math.floor(sec % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

function AddToPlaylistMenu({ track, onClose }) {
  const { playlists, setPlaylists, showToast } = useApp()
  const [show, setShow] = useState(true)

  const handleAdd = async (playlist) => {
    const result = await addTrackToPlaylist(playlist.id, track.id)
    if (result) {
      setPlaylists(prev => prev.map(p => p.id === result.id ? result : p))
      showToast(`Added to "${playlist.name}"`)
    }
    onClose()
  }

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="absolute right-0 top-full mt-1 bg-white rounded-xl shadow-lg border border-pink-100 py-1 z-50 min-w-[160px]">
        <p className="px-3 py-1.5 text-xs font-bold text-gray-400 uppercase">Add to playlist</p>
        {playlists.length === 0 && (
          <p className="px-3 py-2 text-sm text-gray-400">No playlists yet</p>
        )}
        {playlists.map(pl => (
          <button
            key={pl.id}
            onClick={() => handleAdd(pl)}
            className="w-full text-left px-3 py-2 text-sm text-kawaii-text hover:bg-pink-50 transition-colors"
          >
            {pl.name}
          </button>
        ))}
      </div>
    </>
  )
}

export default function TrackRow({ track, onPlay, isActive }) {
  const { isPlaying } = useApp()
  const [showMenu, setShowMenu] = useState(false)

  return (
    <div
      className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 group cursor-pointer ${
        isActive
          ? 'bg-kawaii-pink/15 shadow-sm'
          : ''
      }`}
      onDoubleClick={onPlay}
      onMouseEnter={e => { if (!isActive) e.currentTarget.style.backgroundColor = 'var(--track-hover)' }}
      onMouseLeave={e => { if (!isActive) e.currentTarget.style.backgroundColor = 'transparent' }}
    >
      <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-kawaii-pink/10 flex items-center justify-center">
        {isActive && isPlaying ? (
          <div className="flex items-end gap-0.5 h-5">
            <span className="w-1 bg-kawaii-pink rounded-full animate-bar1" />
            <span className="w-1 bg-kawaii-pink rounded-full animate-bar2" />
            <span className="w-1 bg-kawaii-pink rounded-full animate-bar3" />
            <span className="w-1 bg-kawaii-pink rounded-full animate-bar4" />
          </div>
        ) : track.coverArt ? (
          <img src={track.coverArt} alt="" className="w-full h-full object-cover" />
        ) : (
          <Music size={18} className="text-kawaii-pink/60" />
        )}
        <button
          onClick={(e) => { e.stopPropagation(); onPlay() }}
          className="absolute inset-0 bg-black/0 hover:bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
        >
          <div className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center shadow-md">
            <Play size={14} fill="#FFB7C5" className="text-kawaii-pink ml-0.5" />
          </div>
        </button>
      </div>

      <div className="flex-1 min-w-0 grid grid-cols-3 gap-4 items-center">
        <p className={`text-sm font-semibold truncate ${isActive ? 'text-kawaii-pink' : 'text-kawaii-text'}`}>
          {track.title || 'Unknown Track'}
        </p>
        <p className="text-sm truncate" style={{ color: 'var(--track-muted)' }}>{track.artist || 'Unknown Artist'}</p>
        <div className="flex items-center gap-2">
          <p className="text-sm truncate flex-1" style={{ color: 'var(--track-muted)' }}>{track.album || 'Unknown Album'}</p>
          <span className="text-xs tabular-nums" style={{ color: 'var(--track-muted)' }}>{formatDuration(track.duration)}</span>
        </div>
      </div>

      <div className="relative">
        <button
          onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu) }}
          className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all hover:text-kawaii-text"
          style={{ color: 'var(--track-muted)' }}
          onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--track-hover)' }}
          onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent' }}
        >
          <MoreVertical size={16} />
        </button>
        {showMenu && <AddToPlaylistMenu track={track} onClose={() => setShowMenu(false)} />}
      </div>
    </div>
  )
}
