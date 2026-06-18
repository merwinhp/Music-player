import { useState } from 'react'
import { Plus, Play, Trash2 } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { createPlaylist as createPlaylistDB, deletePlaylist as deletePlaylistDB, removeTrackFromPlaylist } from '../utils/db'
import TrackRow from '../components/TrackRow'

function CreatePlaylistModal({ onClose }) {
  const { setPlaylists, showToast } = useApp()
  const [name, setName] = useState('')

  const handleSubmit = async () => {
    if (!name.trim()) return
    const pl = await createPlaylistDB(name.trim())
    setPlaylists(prev => [...prev, pl])
    showToast(`Created "${name.trim()}"`)
    onClose()
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/20 z-40 flex items-center justify-center" onClick={onClose}>
          <div className="bg-white rounded-2xl shadow-xl p-6 w-80 z-50 animate-scale-in" onClick={e => e.stopPropagation()}>
          <h3 className="text-lg font-bold text-kawaii-text mb-4">New Playlist</h3>
          <input
            type="text"
            placeholder="Playlist name..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            className="w-full px-4 py-2.5 rounded-xl border border-pink-100 bg-pink-50/50
              focus:outline-none focus:ring-2 focus:ring-kawaii-pink/40 text-sm text-kawaii-text
              placeholder-gray-400 mb-4"
            autoFocus
          />
          <div className="flex gap-2 justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-400 hover:text-kawaii-text rounded-full hover:bg-pink-50 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 text-sm font-bold text-white bg-kawaii-pink rounded-full hover:bg-kawaii-pink/90 hover:scale-105 transition-all shadow-sm"
            >
              Create
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default function PlaylistView() {
  const { playlists, library, setPlaylists, setQueueAndPlay, showToast } = useApp()
  const [selectedPlaylistId, setSelectedPlaylistId] = useState(null)
  const [showCreate, setShowCreate] = useState(false)

  const selectedPlaylist = playlists.find(p => p.id === selectedPlaylistId) || null

  const selectedTracks = selectedPlaylist
    ? selectedPlaylist.trackIds
        .map(id => library.find(t => t.id === id))
        .filter(Boolean)
    : []

  const handleDeletePlaylist = async (pl) => {
    await deletePlaylistDB(pl.id)
    setPlaylists(prev => prev.filter(p => p.id !== pl.id))
    if (selectedPlaylistId === pl.id) setSelectedPlaylistId(null)
    showToast(`Deleted "${pl.name}"`)
  }

  const handleRemoveTrack = async (trackId) => {
    const updated = await removeTrackFromPlaylist(selectedPlaylist.id, trackId)
    if (updated) {
      setPlaylists(prev => prev.map(p => p.id === updated.id ? updated : p))
    }
  }

  const handlePlayAll = () => {
    if (selectedTracks.length > 0) {
      setQueueAndPlay(selectedTracks, 0)
    }
  }

  return (
    <div className="flex gap-6">
      <div className="w-64 shrink-0">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-kawaii-text">Playlists</h2>
          <button
            onClick={() => setShowCreate(true)}
            className="p-2 rounded-full bg-kawaii-pink text-white hover:scale-105 transition-all shadow-sm"
          >
            <Plus size={18} />
          </button>
        </div>

        <div className="space-y-1">
          {playlists.map(pl => (
            <div
              key={pl.id}
              className={`group flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-all ${
                selectedPlaylist?.id === pl.id
                  ? 'bg-kawaii-pink/15 text-kawaii-pink font-bold'
                  : 'hover:bg-pink-50 text-kawaii-text'
              }`}
            >
              <span
                className="text-sm truncate flex-1"
                onClick={() => setSelectedPlaylistId(pl.id)}
              >
                ♪ {pl.name}
              </span>
              <button
                onClick={(e) => { e.stopPropagation(); handleDeletePlaylist(pl) }}
                className="p-1 text-gray-300 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
          {playlists.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-8">No playlists yet</p>
          )}
        </div>
      </div>

      <div className="flex-1">
        {selectedPlaylist ? (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <h3 className="text-lg font-bold text-kawaii-text">{selectedPlaylist.name}</h3>
              {selectedTracks.length > 0 && (
                <button
                  onClick={handlePlayAll}
                  className="flex items-center gap-1.5 text-sm font-bold text-white bg-kawaii-pink px-4 py-2 rounded-full hover:scale-105 transition-all shadow-sm"
                >
                  <Play size={16} fill="white" /> Play All
                </button>
              )}
            </div>

            {selectedTracks.length === 0 ? (
              <p className="text-gray-400 text-center py-12">This playlist is empty</p>
            ) : (
              <div className="space-y-1">
                {selectedTracks.map(track => (
                  <div key={track.id} className="group flex items-center">
                    <TrackRow
                      track={track}
                      onPlay={() => { const idx = selectedTracks.findIndex(t => t.id === track.id); setQueueAndPlay(selectedTracks, idx) }}
                      isActive={false}
                    />
                    <button
                      onClick={() => handleRemoveTrack(track.id)}
                      className="p-1.5 text-gray-300 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all ml-1"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center text-gray-400 py-16">
            <p className="text-5xl mb-4">🎧</p>
            <p>Select a playlist to view its tracks</p>
          </div>
        )}
      </div>

      {showCreate && <CreatePlaylistModal onClose={() => setShowCreate(false)} />}
    </div>
  )
}
